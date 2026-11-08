import { sampleImagePixels, ParticleTarget } from './particleMath';

export interface PreparedParticleSystem {
  sourceImg: HTMLImageElement;
  targets: ParticleTarget[];
  step: number;
  naturalWidth: number;
  naturalHeight: number;
}

let cachedPreparedSystem: PreparedParticleSystem | null = null;
let preparePromise: Promise<PreparedParticleSystem> | null = null;

export function getCachedParticleSystem(): PreparedParticleSystem | null {
  return cachedPreparedSystem;
}

/**
 * Pre-computes all heavy pixel sampling and decoding while the Opening Screen is showing.
 * Guaranteed to execute only once.
 */
export async function prepareParticleSystem(): Promise<PreparedParticleSystem> {
  if (cachedPreparedSystem) {
    return cachedPreparedSystem;
  }
  if (preparePromise) {
    return preparePromise;
  }

  preparePromise = new Promise(async (resolve, reject) => {
    try {
      const img = new Image();
      img.src = '/assets/abhilash-portrait.webp';

      if (typeof img.decode === 'function') {
        await img.decode();
      } else {
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
        });
      }

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      // Step: 5 on phones (approx 10,000 particles), 4 on desktop (approx 25,000)
      const step = isMobile ? 5 : 4;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = img.naturalWidth;
      offCanvas.height = img.naturalHeight;
      const ctx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        throw new Error('Could not get offscreen 2d context');
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const targets = sampleImagePixels(imgData, step);

      cachedPreparedSystem = {
        sourceImg: img,
        targets,
        step,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      };

      resolve(cachedPreparedSystem);
    } catch (err) {
      reject(err);
    }
  });

  return preparePromise;
}
