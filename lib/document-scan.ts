import type { Scanner as ScannerType } from "scanic";

let scannerInstance: ScannerType | null = null;

async function getScanner(): Promise<ScannerType> {
  if (!scannerInstance) {
    const { Scanner } = await import("scanic");
    scannerInstance = new Scanner();
    await scannerInstance.initialize();
  }
  return scannerInstance;
}

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal memuat gambar untuk deteksi dokumen."));
    };
    img.decoding = "async";
    img.src = url;
  });
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Gagal mengekspor hasil crop."));
      },
      "image/jpeg",
      quality,
    );
  });
}

/**
 * Mendeteksi batas kertas dan melakukan koreksi perspektif. Mengembalikan null jika tidak terdeteksi.
 */
export async function extractDocumentJpeg(blob: Blob, quality = 0.92): Promise<Blob | null> {
  const img = await loadImageFromBlob(blob);
  const scanner = await getScanner();
  const result = await scanner.scan(img, {
    mode: "extract",
    output: "canvas",
    maxProcessingDimension: 1200,
    minArea: 400,
  });
  if (!result.success || !result.output) return null;
  const canvas = result.output as HTMLCanvasElement;
  return canvasToJpegBlob(canvas, quality);
}
