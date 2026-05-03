import type { IdentificationSession } from './identification-session';
import type { RockMatch } from './mock-data';

export type Vector = number[];

export type VectorIndexItem = {
  id: string;
  label: string;
  kind: 'rock' | 'non-rock';
  embedding: Vector;
};

export type RankedVectorIndexItem = {
  item: VectorIndexItem;
  score: number;
};

export type ClipKnnConfidence = 'High' | 'Medium' | 'Low';

export type ClipKnnRetrievalResult = {
  matches: RankedVectorIndexItem[];
  confidence: ClipKnnConfidence;
  possibleNonRock: boolean;
};

export type ClipKnnAnalyzer = (session: IdentificationSession) => { matches: RockMatch[]; topMatch: RockMatch };

/**
 * Normalizes a vector to unit length (L2 norm = 1).
 * @param vector - Input vector.
 * @returns A new vector with unit length.
 * @throws When the vector is empty, has non-finite values, or has zero magnitude.
 */
export function normalizeVector(vector: Vector): Vector {
  if (vector.length === 0) {
    throw new Error('Vector must have at least one dimension.');
  }

  const magnitude = Math.sqrt(sumSquares(vector));
  if (magnitude === 0) {
    throw new Error('Vector magnitude must be non-zero.');
  }

  return vector.map((value) => value / magnitude);
}

/**
 * Computes cosine similarity between two vectors.
 * @param left - First vector.
 * @param right - Second vector.
 * @returns Cosine similarity in [-1, 1].
 * @throws When the vectors have different dimensions or invalid values.
 */
export function cosineSimilarity(left: Vector, right: Vector): number {
  assertSameDimension(left, right);

  const leftMagnitude = Math.sqrt(sumSquares(left));
  const rightMagnitude = Math.sqrt(sumSquares(right));

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    throw new Error('Vector magnitude must be non-zero.');
  }

  return dot(left, right) / (leftMagnitude * rightMagnitude);
}

/**
 * Ranks reference embeddings by cosine similarity against a query embedding.
 * @param input - Query embedding and reference items.
 * @returns Ranked items (highest similarity first), limited to topK.
 */
export function rankByCosine(input: {
  queryEmbedding: Vector;
  items: VectorIndexItem[];
  topK: number;
}): RankedVectorIndexItem[] {
  const ranked = input.items.map((item) => ({
    item,
    score: cosineSimilarity(input.queryEmbedding, item.embedding),
  }));

  ranked.sort((left, right) => {
    const byScore = right.score - left.score;
    if (byScore !== 0) return byScore;

    return left.item.id.localeCompare(right.item.id);
  });

  return ranked.slice(0, Math.max(0, input.topK));
}

export function retrieveByCosine(input: {
  queryEmbedding: Vector;
  items: VectorIndexItem[];
  topK: number;
}): ClipKnnRetrievalResult {
  const matches = rankByCosine(input);
  const possibleNonRock = isPossibleNonRock(matches);
  const confidence = calculateConfidence(matches, possibleNonRock);

  return {
    matches,
    confidence,
    possibleNonRock,
  };
}

/**
 * Creates an analyzer that uses a CLIP-style embedding function plus cosine kNN retrieval
 * and adapts the output into the existing app/eval match shape.
 * @param input - Embedder and reference index inputs.
 * @returns Analyzer function that can be used in eval and later wired into the app.
 */
export function createClipKnnAnalyzer(input: {
  embed: (session: IdentificationSession) => Vector;
  index: VectorIndexItem[];
  topK: number;
}): ClipKnnAnalyzer {
  return (session) => {
    if (input.index.length === 0) {
      throw new Error('CLIP kNN index must not be empty.');
    }

    const queryEmbedding = input.embed(session);
    const retrieval = retrieveByCosine({ queryEmbedding, items: input.index, topK: input.topK });

    const matches = retrieval.matches.map((match, index) => ({
      name: match.item.label,
      category: match.item.kind === 'non-rock' ? 'Non-rock look-alike' : 'Rock',
      confidence: index === 0 ? retrieval.confidence : 'Low',
      score: similarityToPercent(match.score),
    }));

    const topMatch = matches[0];
    if (!topMatch) {
      throw new Error('CLIP kNN retrieval returned no matches.');
    }

    return { matches, topMatch };
  };
}

function isPossibleNonRock(matches: RankedVectorIndexItem[]): boolean {
  const nonRockCount = matches.filter((match) => match.item.kind === 'non-rock').length;
  if (nonRockCount >= 2) return true;
  return matches[0]?.item.kind === 'non-rock';
}

function calculateConfidence(matches: RankedVectorIndexItem[], possibleNonRock: boolean): ClipKnnConfidence {
  const top = matches[0]?.score ?? -Infinity;
  const second = matches[1]?.score ?? -Infinity;
  const margin = top - second;

  let confidence: ClipKnnConfidence = 'Low';

  if (top >= 0.35 && margin >= 0.08) {
    confidence = 'High';
  } else if (top >= 0.25) {
    confidence = 'Medium';
  }

  if (possibleNonRock && confidence === 'High') {
    return 'Medium';
  }

  return confidence;
}

/**
 * Maps cosine similarity [-1, 1] to an integer percentage score [0, 100].
 * @param similarity - Cosine similarity.
 * @returns Percent score for UI display.
 */
function similarityToPercent(similarity: number): number {
  const normalized = (similarity + 1) / 2;
  const clamped = Math.min(1, Math.max(0, normalized));
  return Math.round(clamped * 100);
}

/**
 * Computes dot product and validates numeric inputs.
 * @param left - First vector.
 * @param right - Second vector.
 * @returns Dot product.
 */
function dot(left: Vector, right: Vector): number {
  assertSameDimension(left, right);

  let total = 0;
  for (let i = 0; i < left.length; i += 1) {
    const leftValue = assertFiniteNumber(left[i]);
    const rightValue = assertFiniteNumber(right[i]);
    total += leftValue * rightValue;
  }

  return total;
}

/**
 * Computes sum of squares and validates numeric inputs.
 * @param vector - Input vector.
 * @returns Sum of squares.
 */
function sumSquares(vector: Vector): number {
  let total = 0;
  for (const rawValue of vector) {
    const value = assertFiniteNumber(rawValue);
    total += value * value;
  }

  return total;
}

/**
 * Ensures both vectors have the same length.
 * @param left - First vector.
 * @param right - Second vector.
 * @throws When lengths differ.
 */
function assertSameDimension(left: Vector, right: Vector): void {
  if (left.length !== right.length) {
    throw new Error(`Vector dimension mismatch: ${left.length} vs ${right.length}`);
  }
}

/**
 * Guards against NaN/Infinity values inside vectors.
 * @param value - Candidate number.
 * @returns The same number if finite.
 * @throws When value is not a finite number.
 */
function assertFiniteNumber(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Vector values must be finite numbers.');
  }

  return value;
}
