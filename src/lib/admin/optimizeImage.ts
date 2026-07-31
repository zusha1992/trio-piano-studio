// Client-side image optimization.
//
// Runs entirely in the browser (canvas → WebP) before upload, so the Worker
// never spends CPU re-encoding and we stay well inside the free tier. Supports
// an optional cover-crop to a target aspect ratio (for fixed containers like
// founder squares) and a circular mask (for brand/origin icons).

export interface OptimizeOptions {
  /** Longest output edge in px; the image is downscaled to fit. */
  maxEdge?: number;
  /** WebP quality, 0–1. */
  quality?: number;
  /** Target width/height ratio; the source is center-cropped to match. */
  aspect?: number;
  /** Mask the output to a circle (icons). */
  circle?: boolean;
}

export interface OptimizedImage {
  blob: Blob;
  width: number;
  height: number;
}

export async function optimizeImage(file: File, opts: OptimizeOptions = {}): Promise<OptimizedImage> {
  const { maxEdge = 2000, quality = 0.82, aspect, circle = false } = opts;

  const bitmap = await createImageBitmap(file);

  // Source crop rectangle — center-crop to the target aspect when requested.
  let sx = 0;
  let sy = 0;
  let sw = bitmap.width;
  let sh = bitmap.height;
  if (aspect) {
    const srcAspect = bitmap.width / bitmap.height;
    if (srcAspect > aspect) {
      sw = Math.round(bitmap.height * aspect);
      sx = Math.round((bitmap.width - sw) / 2);
    } else {
      sh = Math.round(bitmap.width / aspect);
      sy = Math.round((bitmap.height - sh) / 2);
    }
  }

  // Output size — downscale so the longest edge is at most maxEdge.
  let ow = sw;
  let oh = sh;
  const longest = Math.max(sw, sh);
  if (longest > maxEdge) {
    const scale = maxEdge / longest;
    ow = Math.round(sw * scale);
    oh = Math.round(sh * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = ow;
  canvas.height = oh;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  if (circle) {
    ctx.beginPath();
    ctx.arc(ow / 2, oh / 2, Math.min(ow, oh) / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  }

  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, ow, oh);
  bitmap.close?.();

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('WebP encode failed'))), 'image/webp', quality),
  );

  return { blob, width: ow, height: oh };
}
