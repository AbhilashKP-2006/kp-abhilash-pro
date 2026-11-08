/**
 * Pure mathematical utilities for particle physics, sampling, and layout.
 */

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
}

export function shouldIncludePixel(alpha: number, threshold: number = 160): boolean {
  return alpha > threshold;
}

export interface ParticleTarget {
  targetX: number;
  targetY: number;
  r: number;
  g: number;
  b: number;
}

/**
 * Clean edge pixel sampling (alpha > 160) using exact PNG colours without brightness boost
 */
export function sampleImagePixels(
  imageData: ImageData,
  step: number = 4
): ParticleTarget[] {
  const { width, height, data } = imageData;
  const particles: ParticleTarget[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const a = data[idx + 3];
      if (shouldIncludePixel(a, 160)) {
        particles.push({
          targetX: x,
          targetY: y,
          r: data[idx] / 255,
          g: data[idx + 1] / 255,
          b: data[idx + 2] / 255,
        });
      }
    }
  }

  return particles;
}

/**
 * Swarm Coordinates & Curve parameter calculation:
 * - start position: angle = random 0 to 2π, radius = max(W,H) x (0.55 + random x 0.6) from centre
 * - (sx, sy) = centre + (cos angle, sin angle) x radius
 * - delay = random 0 to 0.4
 * - curve K = (random - 0.5) x 0.9
 */
export function computeSwarmStart(
  canvasWidth: number,
  canvasHeight: number,
  index: number,
  total: number
): { startX: number; startY: number; delay: number; curveK: number } {
  const hash1 = (index * 1664525 + 1013904223) >>> 0;
  const rand1 = (hash1 % 100000) / 100000;

  const hash2 = (hash1 * 1664525 + 1013904223) >>> 0;
  const rand2 = (hash2 % 100000) / 100000;

  const hash3 = (hash2 * 1664525 + 1013904223) >>> 0;
  const rand3 = (hash3 % 100000) / 100000;

  const hash4 = (hash3 * 1664525 + 1013904223) >>> 0;
  const rand4 = (hash4 % 100000) / 100000;

  const angle = rand1 * Math.PI * 2;
  const maxDim = Math.max(canvasWidth, canvasHeight);
  const radius = maxDim * (0.55 + rand2 * 0.6);

  const cx = canvasWidth * 0.5;
  const cy = canvasHeight * 0.5;

  const startX = cx + Math.cos(angle) * radius;
  const startY = cy + Math.sin(angle) * radius;

  const delay = rand3 * 0.4;
  const curveK = (rand4 - 0.5) * 0.9;

  return { startX, startY, delay, curveK };
}

/**
 * Exact motion evaluation:
 * p = clamp((t - delay) / 0.6, 0, 1)
 * e = 1 - (1 - p)^3
 * wv = sin(p x π) x K
 * x = sx + (tx - sx) x e - (ty - sy) x wv
 * y = sy + (ty - sy) x e + (tx - sx) x wv
 */
export function evaluateParticleMotion(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  delay: number,
  curveK: number,
  t: number
): { x: number; y: number; p: number } {
  const p = Math.max(0, Math.min(1, (t - delay) / 0.6));
  const e = 1 - Math.pow(1 - p, 3);
  const wv = Math.sin(p * Math.PI) * curveK;

  const diffX = tx - sx;
  const diffY = ty - sy;

  const x = sx + diffX * e - diffY * wv;
  const y = sy + diffY * e + diffX * wv;

  return { x, y, p };
}
