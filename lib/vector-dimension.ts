import { normalizeVector, type Vector } from './clip-knn';

/**
 * Adapts a vector to a target dimension by truncating or zero-padding, then normalizing.
 * @param input - Source vector.
 * @param dimension - Target dimension (positive integer).
 * @returns Normalized vector of exactly `dimension` length.
 */
export function adaptVectorToDimension(input: Vector, dimension: number): Vector {
  if (!Number.isInteger(dimension) || dimension <= 0) {
    throw new Error('Target dimension must be a positive integer.');
  }

  let adapted: number[];
  if (input.length === dimension) {
    adapted = [...input];
  } else if (input.length > dimension) {
    adapted = input.slice(0, dimension);
  } else {
    adapted = [...input, ...Array.from({ length: dimension - input.length }, () => 0)];
  }

  return normalizeVector(adapted);
}

