export type ImageQualityLabel = 'Good' | 'Fair' | 'Poor' | 'Unknown';

export type ImageQualityHints = {
  sharpness: ImageQualityLabel;
  lighting: ImageQualityLabel;
  framing: ImageQualityLabel;
  tip: string;
};

export type ImageQualityPhotoInput = {
  uri?: string;
  width?: number;
  height?: number;
};

/**
 * Produces lightweight, deterministic image-quality hints from the photo metadata we have locally.
 * @param photo - Selected photo metadata (URI + optional dimensions).
 * @returns Display-ready quality labels and a single suggested tip.
 */
export function evaluateImageQuality(photo?: ImageQualityPhotoInput | null): ImageQualityHints {
  if (!photo || typeof photo.uri !== 'string' || photo.uri.length === 0) {
    return {
      sharpness: 'Unknown',
      lighting: 'Unknown',
      framing: 'Unknown',
      tip: 'Tip: take or upload a clear rock photo to unlock quality hints.',
    };
  }

  const sharpness = evaluateSharpness(photo.width, photo.height);
  const framing = evaluateFraming(photo.width, photo.height);
  const lighting = evaluateLighting(sharpness, framing);

  return {
    sharpness,
    lighting,
    framing,
    tip: tipFor({ sharpness, lighting, framing }),
  };
}

/**
 * Approximates perceived sharpness using available pixel dimensions (a proxy for detail).
 * @param width - Image width in pixels.
 * @param height - Image height in pixels.
 * @returns A coarse sharpness label.
 */
function evaluateSharpness(width?: number, height?: number): ImageQualityLabel {
  const minDimension = minPositive(width, height);
  if (minDimension === null) return 'Unknown';
  if (minDimension >= 1200) return 'Good';
  if (minDimension >= 800) return 'Fair';
  return 'Poor';
}

/**
 * Estimates framing quality via the aspect ratio; extreme ratios tend to indicate awkward framing.
 * @param width - Image width in pixels.
 * @param height - Image height in pixels.
 * @returns A coarse framing label.
 */
function evaluateFraming(width?: number, height?: number): ImageQualityLabel {
  if (!isPositiveNumber(width) || !isPositiveNumber(height)) return 'Unknown';

  const ratio = Math.max(width, height) / Math.min(width, height);
  if (ratio <= 1.45) return 'Good';
  if (ratio <= 1.85) return 'Fair';
  return 'Poor';
}

/**
 * Uses available signals to select a stable lighting label without attempting to infer exposure from pixels.
 * @param sharpness - Evaluated sharpness label.
 * @param framing - Evaluated framing label.
 * @returns A coarse lighting label.
 */
function evaluateLighting(sharpness: ImageQualityLabel, framing: ImageQualityLabel): ImageQualityLabel {
  if (sharpness === 'Unknown' && framing === 'Unknown') return 'Unknown';
  if (sharpness === 'Poor') return 'Fair';
  return 'Fair';
}

/**
 * Chooses a single, user-facing tip based on the lowest-quality signal.
 * @param hints - Current quality hints.
 * @returns A short action-oriented tip.
 */
function tipFor(hints: Pick<ImageQualityHints, 'sharpness' | 'lighting' | 'framing'>): string {
  if (hints.sharpness === 'Poor') return 'Tip: hold steady and retake in brighter light for a sharper photo.';
  if (hints.framing === 'Poor') return 'Tip: fill most of the frame with the rock surface.';
  if (hints.sharpness === 'Fair' || hints.lighting === 'Fair' || hints.framing === 'Fair') {
    return 'Tip: brighter, even light may improve accuracy.';
  }
  return 'Tip: quality looks good — continue when ready.';
}

/**
 * Returns the smallest positive number in the pair, or null when neither value is usable.
 * @param first - First candidate.
 * @param second - Second candidate.
 * @returns The smallest positive number, or null.
 */
function minPositive(first?: number, second?: number): number | null {
  const values = [first, second].filter(isPositiveNumber).sort((a, b) => a - b);
  return values.length > 0 ? values[0] : null;
}

/**
 * Guards numeric checks so we don't treat NaN or negative values as usable pixel dimensions.
 * @param value - Candidate value.
 * @returns True when value is a finite positive number.
 */
function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}
