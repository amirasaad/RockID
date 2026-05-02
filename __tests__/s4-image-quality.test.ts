import { describe, expect, it } from 'vitest';

import { evaluateImageQuality } from '@/lib/image-quality';

describe('S4 image quality hints', () => {
  it('returns Unknown labels when no photo is available', () => {
    const hints = evaluateImageQuality(null);

    expect(hints.sharpness).toBe('Unknown');
    expect(hints.lighting).toBe('Unknown');
    expect(hints.framing).toBe('Unknown');
    expect(hints.tip).toContain('Tip:');
  });

  it('flags low-resolution images as Poor sharpness', () => {
    const hints = evaluateImageQuality({
      uri: 'file:///field/rock.jpg',
      width: 640,
      height: 480,
    });

    expect(hints.sharpness).toBe('Poor');
  });

  it('flags extreme aspect ratios as Poor framing', () => {
    const hints = evaluateImageQuality({
      uri: 'file:///field/rock.jpg',
      width: 4000,
      height: 800,
    });

    expect(hints.framing).toBe('Poor');
  });
});
