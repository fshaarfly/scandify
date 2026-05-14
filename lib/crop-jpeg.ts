/** Memotong JPEG/Blob gambar ke persegi piksel (sumber = koordinat bitmap asli). */
export async function cropJpegBlob(
  blob: Blob,
  rect: { sx: number; sy: number; sw: number; sh: number },
  quality = 0.92,
): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  try {
    const sx = Math.max(0, Math.floor(rect.sx));
    const sy = Math.max(0, Math.floor(rect.sy));
    const sw = Math.min(bitmap.width - sx, Math.max(1, Math.round(rect.sw)));
    const sh = Math.min(bitmap.height - sy, Math.max(1, Math.round(rect.sh)));
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas tidak tersedia.");
    ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, sw, sh);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Gagal mengekspor crop."));
        },
        "image/jpeg",
        quality,
      );
    });
  } finally {
    bitmap.close();
  }
}
