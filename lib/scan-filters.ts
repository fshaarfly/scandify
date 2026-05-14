/** Gaya tampilan mirip preset scanner (Adobe Scan–style). */
export type ScanFilterId = "original" | "auto" | "vivid" | "grayscale" | "document";

export const SCAN_FILTER_OPTIONS: { id: ScanFilterId; label: string; hint: string }[] = [
  { id: "original", label: "Asli", hint: "Tanpa penyesuaian warna" },
  { id: "auto", label: "Otomatis", hint: "Kontras & keseimbangan warna" },
  { id: "vivid", label: "Cerah", hint: "Warna lebih hidup" },
  { id: "grayscale", label: "Abu-abu", hint: "Hitam putih halus" },
  { id: "document", label: "Dokumen", hint: "Teks tegas (B&W)" },
];

function histogramChannel(data: Uint8ClampedArray, channel: 0 | 1 | 2, out: number[]) {
  out.fill(0);
  for (let i = channel; i < data.length; i += 4) {
    out[data[i]]++;
  }
  return out;
}

function percentileFromHist(hist: number[], tailFrac: number) {
  const total = hist.reduce((a, b) => a + b, 0);
  if (total === 0) return { low: 0, high: 255 };
  const tail = total * tailFrac;
  let cum = 0;
  let low = 0;
  for (let i = 0; i < 256; i++) {
    cum += hist[i];
    if (cum >= tail) {
      low = i;
      break;
    }
  }
  cum = 0;
  let high = 255;
  for (let i = 255; i >= 0; i--) {
    cum += hist[i];
    if (cum >= tail) {
      high = i;
      break;
    }
  }
  if (high - low < 24) return { low: 0, high: 255 };
  return { low, high };
}

function otsuThreshold(gray: Uint8ClampedArray, w: number, h: number): number {
  const hist = new Array(256).fill(0);
  const n = w * h;
  for (let i = 0; i < n; i++) {
    hist[gray[i]]++;
  }
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    wF = n - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > varMax) {
      varMax = between;
      threshold = t;
    }
  }
  return threshold;
}

function boxBlurGray(src: Uint8ClampedArray, w: number, h: number, radius: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(src.length);
  const tmp = new Uint8ClampedArray(src.length);
  const r = radius;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let c = 0;
      for (let dx = -r; dx <= r; dx++) {
        const xx = Math.min(w - 1, Math.max(0, x + dx));
        sum += src[y * w + xx];
        c++;
      }
      tmp[y * w + x] = Math.round(sum / c);
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let c = 0;
      for (let dy = -r; dy <= r; dy++) {
        const yy = Math.min(h - 1, Math.max(0, y + dy));
        sum += tmp[yy * w + x];
        c++;
      }
      out[y * w + x] = Math.round(sum / c);
    }
  }
  return out;
}

function applyFilterToImageData(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  filter: ScanFilterId,
): Uint8ClampedArray {
  const d = new Uint8ClampedArray(data);
  const n = w * h;

  if (filter === "original") {
    return d;
  }

  if (filter === "grayscale") {
    for (let i = 0; i < d.length; i += 4) {
      const y = (d[i] * 54 + d[i + 1] * 183 + d[i + 2] * 19) >> 8;
      d[i] = d[i + 1] = d[i + 2] = y;
    }
    return d;
  }

  if (filter === "vivid") {
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const y = (r * 54 + g * 183 + b * 19) >> 8;
      const sat = 1.28;
      d[i] = Math.min(255, Math.max(0, Math.round(y + (r - y) * sat)));
      d[i + 1] = Math.min(255, Math.max(0, Math.round(y + (g - y) * sat)));
      d[i + 2] = Math.min(255, Math.max(0, Math.round(y + (b - y) * sat)));
    }
    return d;
  }

  if (filter === "auto") {
    const histR = new Array(256).fill(0);
    const histG = new Array(256).fill(0);
    const histB = new Array(256).fill(0);
    histogramChannel(d, 0, histR);
    histogramChannel(d, 1, histG);
    histogramChannel(d, 2, histB);
    const rRange = percentileFromHist(histR, 0.015);
    const gRange = percentileFromHist(histG, 0.015);
    const bRange = percentileFromHist(histB, 0.015);

    const stretch = (v: number, low: number, high: number) => {
      if (high <= low) return v;
      return Math.min(255, Math.max(0, Math.round(((v - low) * 255) / (high - low))));
    };

    for (let i = 0; i < d.length; i += 4) {
      d[i] = stretch(d[i], rRange.low, rRange.high);
      d[i + 1] = stretch(d[i + 1], gRange.low, gRange.high);
      d[i + 2] = stretch(d[i + 2], bRange.low, bRange.high);
    }
    return d;
  }

  if (filter === "document") {
    const gray = new Uint8ClampedArray(n);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      gray[j] = (d[i] * 54 + d[i + 1] * 183 + d[i + 2] * 19) >> 8;
    }
    const blurred = boxBlurGray(gray, w, h, 1);
    const t = otsuThreshold(blurred, w, h);
    // Narrow margin clips almost everything to pure B&W and erases fine type; a wider
    // band keeps a readable gray ramp (still “document” but not posterized).
    const margin = 42;
    const lo = Math.max(0, t - margin);
    const hi = Math.min(255, t + margin);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      const vBlur = blurred[j];
      const v = gray[j];
      let o: number;
      if (vBlur < lo) o = 10;
      else if (vBlur > hi) o = 248;
      else o = Math.round(((v - lo) * 255) / (hi - lo || 1));
      o = Math.min(255, Math.max(0, o));
      d[i] = d[i + 1] = d[i + 2] = o;
    }
    return d;
  }

  return d;
}

export async function applyScanFilterToJpeg(blob: Blob, filter: ScanFilterId, quality = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  try {
    const w = bitmap.width;
    const h = bitmap.height;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas tidak tersedia.");
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, w, h);
    const out = applyFilterToImageData(imageData.data, w, h, filter);
    imageData.data.set(out);
    ctx.putImageData(imageData, 0, 0);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Gagal mengonversi gambar."));
        },
        "image/jpeg",
        quality,
      );
    });
  } finally {
    bitmap.close();
  }
}
