import { PDFDocument } from "pdf-lib";

/** Each buffer must be a valid JPEG raster (e.g. normalized in the client). */
export async function buildScanPdfFromJpegs(jpegs: Uint8Array[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  for (const bytes of jpegs) {
    const img = await pdf.embedJpg(bytes);
    const w = img.width;
    const h = img.height;
    const page = pdf.addPage([w, h]);
    page.drawImage(img, { x: 0, y: 0, width: w, height: h });
  }

  return pdf.save();
}
