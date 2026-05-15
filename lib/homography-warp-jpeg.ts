/**
 * Memetakan segi empat di bitmap ke JPEG persegi panjang dengan transformasi perspektif (homografi).
 * Sudut sumber: TL, TR, BR, BL (searah jarum jam dari kiri atas), dalam piksel gambar.
 */

export type QuadCropPixels = {
  tl: { x: number; y: number };
  tr: { x: number; y: number };
  br: { x: number; y: number };
  bl: { x: number; y: number };
};

function sampleBilinear(
  data: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  x: number,
  y: number,
): [number, number, number, number] {
  if (x <= 0) x = 0;
  if (y <= 0) y = 0;
  if (x >= srcW - 1) x = srcW - 1 - 1e-6;
  if (y >= srcH - 1) y = srcH - 1 - 1e-6;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, srcW - 1);
  const y1 = Math.min(y0 + 1, srcH - 1);
  const fx = x - x0;
  const fy = y - y0;
  const i00 = (y0 * srcW + x0) * 4;
  const i10 = (y0 * srcW + x1) * 4;
  const i01 = (y1 * srcW + x0) * 4;
  const i11 = (y1 * srcW + x1) * 4;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const r = lerp(
    lerp(data[i00]!, data[i10]!, fx),
    lerp(data[i01]!, data[i11]!, fx),
    fy,
  );
  const g = lerp(
    lerp(data[i00 + 1]!, data[i10 + 1]!, fx),
    lerp(data[i01 + 1]!, data[i11 + 1]!, fx),
    fy,
  );
  const b = lerp(
    lerp(data[i00 + 2]!, data[i10 + 2]!, fx),
    lerp(data[i01 + 2]!, data[i11 + 2]!, fx),
    fy,
  );
  const a = lerp(
    lerp(data[i00 + 3]!, data[i10 + 3]!, fx),
    lerp(data[i01 + 3]!, data[i11 + 3]!, fx),
    fy,
  );
  return [r, g, b, a];
}

/** h33 = 1; memetakan (xd,yd) di bidang tujuan → (xs,ys) di sumber. */
function homographyFromDstToSrc(
  dst: readonly [readonly [number, number], readonly [number, number], readonly [number, number], readonly [number, number]],
  src: readonly [readonly [number, number], readonly [number, number], readonly [number, number], readonly [number, number]],
): number[] {
  const A: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  const b: number[] = Array(8).fill(0);
  for (let i = 0; i < 4; i++) {
    const [xd, yd] = dst[i]!;
    const [xs, ys] = src[i]!;
    const r0 = 2 * i;
    const r1 = r0 + 1;
    A[r0]![0] = xd;
    A[r0]![1] = yd;
    A[r0]![2] = 1;
    A[r0]![6] = -xd * xs;
    A[r0]![7] = -yd * xs;
    b[r0] = xs;
    A[r1]![3] = xd;
    A[r1]![4] = yd;
    A[r1]![5] = 1;
    A[r1]![6] = -xd * ys;
    A[r1]![7] = -yd * ys;
    b[r1] = ys;
  }
  return solve8(A, b);
}

function solve8(A: number[][], b: number[]): number[] {
  const n = 8;
  const M = A.map((row, i) => [...row, b[i]!]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r]![col]!) > Math.abs(M[piv]![col]!)) piv = r;
    }
    if (Math.abs(M[piv]![col]!) < 1e-12) {
      throw new Error("Homografi singular (titik hampir segaris).");
    }
    if (piv !== col) [M[col], M[piv]] = [M[piv]!, M[col]!];
    const div = M[col]![col]!;
    for (let c = col; c <= n; c++) M[col]![c]! /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r]![col]!;
      if (f === 0) continue;
      for (let c = col; c <= n; c++) M[r]![c]! -= f * M[col]![c]!;
    }
  }
  return M.map((row) => row[n]!);
}

function applyHomography(H: readonly number[], xd: number, yd: number): [number, number] {
  const wz = H[6]! * xd + H[7]! * yd + 1;
  if (Math.abs(wz) < 1e-10) return [NaN, NaN];
  const wx = H[0]! * xd + H[1]! * yd + H[2]!;
  const wy = H[3]! * xd + H[4]! * yd + H[5]!;
  return [wx / wz, wy / wz];
}

export async function homographyWarpJpegBlob(
  blob: Blob,
  crop: QuadCropPixels,
  quality = 0.92,
): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  try {
    const srcW = bitmap.width;
    const srcH = bitmap.height;
    const { tl, tr, br, bl } = crop;
    const src: [[number, number], [number, number], [number, number], [number, number]] = [
      [tl.x, tl.y],
      [tr.x, tr.y],
      [br.x, br.y],
      [bl.x, bl.y],
    ];
    const dst: [[number, number], [number, number], [number, number], [number, number]] = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    const h8 = homographyFromDstToSrc(dst, src);
    const H = [...h8, 1] as const;

    const wTop = Math.hypot(tr.x - tl.x, tr.y - tl.y);
    const wBot = Math.hypot(br.x - bl.x, br.y - bl.y);
    const hLeft = Math.hypot(bl.x - tl.x, bl.y - tl.y);
    const hRight = Math.hypot(br.x - tr.x, br.y - tr.y);
    /** Rata-rata sisi berlawanan: `max` memperlebar satu sumbu dan membuat hasil terlihat ter-stretch. */
    const outW = Math.max(1, Math.round((wTop + wBot) / 2));
    const outH = Math.max(1, Math.round((hLeft + hRight) / 2));

    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = srcW;
    srcCanvas.height = srcH;
    const sctx = srcCanvas.getContext("2d");
    if (!sctx) throw new Error("Canvas tidak tersedia.");
    sctx.drawImage(bitmap, 0, 0);
    const srcData = sctx.getImageData(0, 0, srcW, srcH);
    const srcBuf = srcData.data;

    const outCanvas = document.createElement("canvas");
    outCanvas.width = outW;
    outCanvas.height = outH;
    const octx = outCanvas.getContext("2d");
    if (!octx) throw new Error("Canvas tidak tersedia.");
    const outImage = octx.createImageData(outW, outH);
    const outBuf = outImage.data;

    const denomW = outW > 1 ? outW - 1 : 1;
    const denomH = outH > 1 ? outH - 1 : 1;

    for (let j = 0; j < outH; j++) {
      const yd = j / denomH;
      for (let i = 0; i < outW; i++) {
        const xd = i / denomW;
        const [sx, sy] = applyHomography(H, xd, yd);
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        if (Number.isFinite(sx) && Number.isFinite(sy)) {
          [r, g, b, a] = sampleBilinear(srcBuf, srcW, srcH, sx, sy);
        }
        const o = (j * outW + i) * 4;
        outBuf[o] = r;
        outBuf[o + 1] = g;
        outBuf[o + 2] = b;
        outBuf[o + 3] = a;
      }
    }
    octx.putImageData(outImage, 0, 0);

    return new Promise((resolve, reject) => {
      outCanvas.toBlob(
        (bOut) => {
          if (bOut) resolve(bOut);
          else reject(new Error("Gagal mengekspor warp homografi."));
        },
        "image/jpeg",
        quality,
      );
    });
  } finally {
    bitmap.close();
  }
}
