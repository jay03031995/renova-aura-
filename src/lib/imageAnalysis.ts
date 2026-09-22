/**
 * Browser-side image analysis — pixel sampling, no ML.
 *
 * Given a user-uploaded photo (as a data URL), we:
 *  1. Draw it to an off-screen canvas
 *  2. Sample pixels from the centre region (assumed to be the face)
 *  3. Compute average lightness, redness, and texture variance
 *  4. Map to Fitzpatrick skin type + flag potential rosacea/acne
 *
 * This is HEURISTIC computer-vision, not deep learning. It works
 * passably for clear face-centred portraits in good light. Outputs
 * are surfaced as "smart defaults — please confirm" in the UI so
 * the patient always has the final say.
 */
import type { Fitzpatrick, SkinType } from "./skinAnalysis";

export type ImageAnalysisResult = {
  fitzpatrick: Fitzpatrick;
  skinType: SkinType;
  rednessFlag: boolean;
  textureFlag: boolean;
  lightness: number; // 0–255 average L of sampled pixels
  redness: number; // 0–100 normalised red-vs-green index
  textureVariance: number; // pixel standard deviation
};

/** Map a 0–255 lightness value to a Fitzpatrick band. Calibrated for
 * face-region average lightness under normal lighting. */
function lightnessToFitzpatrick(L: number): Fitzpatrick {
  if (L >= 220) return "I";
  if (L >= 195) return "II";
  if (L >= 170) return "III";
  if (L >= 140) return "IV";
  if (L >= 100) return "V";
  return "VI";
}

/**
 * Returns a Promise that resolves with the analysis once the image
 * has been loaded and pixels sampled. Always returns a valid result;
 * if anything fails we fall back to sensible neutral defaults so the
 * UX never breaks.
 */
export function analyseImage(dataUrl: string): Promise<ImageAnalysisResult> {
  return new Promise((resolve) => {
    const fallback: ImageAnalysisResult = {
      fitzpatrick: "IV",
      skinType: "normal",
      rednessFlag: false,
      textureFlag: false,
      lightness: 0,
      redness: 0,
      textureVariance: 0,
    };
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onerror = () => resolve(fallback);
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          // Downsample large photos to a 200px max edge — faster + same result
          const maxEdge = 200;
          const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(fallback);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Sample from centre 50% of the image (typical face region)
          const sx = Math.round(canvas.width * 0.25);
          const sy = Math.round(canvas.height * 0.2);
          const sw = Math.round(canvas.width * 0.5);
          const sh = Math.round(canvas.height * 0.6);
          const data = ctx.getImageData(sx, sy, sw, sh).data;

          let rSum = 0,
            gSum = 0,
            bSum = 0,
            count = 0;
          const lightnesses: number[] = [];
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Skin-tone heuristic — exclude pure background pixels
            if (r < 40 && g < 40 && b < 40) continue; // black
            if (r > 240 && g > 240 && b > 240) continue; // white
            rSum += r;
            gSum += g;
            bSum += b;
            const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            lightnesses.push(L);
            count += 1;
          }
          if (count < 50) return resolve(fallback);

          const rAvg = rSum / count;
          const gAvg = gSum / count;
          const bAvg = bSum / count;
          const lAvg =
            lightnesses.reduce((a, b) => a + b, 0) / lightnesses.length;

          // Variance for texture estimate
          const lVar =
            lightnesses.reduce((a, b) => a + (b - lAvg) ** 2, 0) /
            lightnesses.length;
          const lStd = Math.sqrt(lVar);

          // Redness — how much red dominates green
          const redness =
            Math.max(0, ((rAvg - gAvg) / Math.max(1, rAvg)) * 100);

          const fitzpatrick = lightnessToFitzpatrick(lAvg);

          // Skin type heuristic — uniform light + low std → normal; high std → combo/dry
          let skinType: SkinType = "normal";
          if (lStd > 36) skinType = "combination";
          if (lStd > 48) skinType = "dry";
          if (redness > 18) skinType = "sensitive";
          if (rAvg > 200 && gAvg > 170 && bAvg < 150 && lStd < 30)
            skinType = "oily";

          resolve({
            fitzpatrick,
            skinType,
            rednessFlag: redness > 18,
            textureFlag: lStd > 38,
            lightness: Math.round(lAvg),
            redness: Math.round(redness * 10) / 10,
            textureVariance: Math.round(lStd * 10) / 10,
          });
        } catch {
          resolve(fallback);
        }
      };
      img.src = dataUrl;
    } catch {
      resolve(fallback);
    }
  });
}

/** Read a File into a data URL. */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Downscale a data URL to a max-edge limit, return a new JPEG data URL.
 * Used to keep PDF embeds and lead-document payloads small.
 */
export function downscaleDataUrl(
  dataUrl: string,
  maxEdge = 800,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(dataUrl);
    img.onload = () => {
      try {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(dataUrl);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(dataUrl);
      }
    };
    img.src = dataUrl;
  });
}
