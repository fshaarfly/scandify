"use client";

import {
  ArrowDown,
  ArrowUp,
  Camera,
  Crop,
  FileDown,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  VideoOff,
} from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { ManualCropDialog } from "@/components/manual-crop-dialog";
import { buildScanPdfFromJpegs } from "@/lib/build-scan-pdf";
import { cropJpegBlob } from "@/lib/crop-jpeg";
import { extractDocumentJpeg } from "@/lib/document-scan";
import { applyScanFilterToJpeg, SCAN_FILTER_OPTIONS, type ScanFilterId } from "@/lib/scan-filters";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ScanPage = {
  id: string;
  previewUrl: string;
  jpegBlob: Blob;
  /** Gambar asli setelah normalisasi JPEG (sebelum crop). */
  rawJpegBlob: Blob;
  /** Setelah deteksi kertas / perspektif (atau sama dengan raw jika tidak ada crop). */
  baseBlob: Blob;
  filter: ScanFilterId;
  docDetected: boolean;
  /** Area halaman ditentukan lewat crop manual dari gambar asli. */
  manualCrop: boolean;
};

async function blobToJpeg(blob: Blob, quality = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia.");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

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
}

function downloadBytes(data: Uint8Array, filename: string) {
  const copy = new Uint8Array(data);
  const blob = new Blob([copy], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ScanWorkspace() {
  const fileInputId = useId();
  const [pages, setPages] = useState<ScanPage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [autoCropEnabled, setAutoCropEnabled] = useState(true);
  const [manualCropObjectUrl, setManualCropObjectUrl] = useState<string | null>(null);
  const [manualCropTargetId, setManualCropTargetId] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /** Rasio frame stream (w/h) agar pratinjau tidak terpotong seperti kotak 16:9 + object-cover. */
  const [cameraPreviewRatio, setCameraPreviewRatio] = useState<{ w: number; h: number } | null>(null);
  const pagesRef = useRef<ScanPage[]>([]);
  const autoCropRef = useRef(autoCropEnabled);

  const activePage = useMemo(() => {
    if (pages.length === 0) return null;
    const match = selectedId ? pages.find((p) => p.id === selectedId) : undefined;
    return match ?? pages[0] ?? null;
  }, [pages, selectedId]);

  const closeManualCropDialog = useCallback(() => {
    setManualCropObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setManualCropTargetId(null);
  }, []);

  const openManualCrop = useCallback(() => {
    const page = activePage;
    if (!page) return;
    setManualCropObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(page.rawJpegBlob);
    });
    setManualCropTargetId(page.id);
  }, [activePage]);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  useEffect(() => {
    autoCropRef.current = autoCropEnabled;
  }, [autoCropEnabled]);

  useEffect(() => {
    return () => {
      for (const p of pagesRef.current) URL.revokeObjectURL(p.previewUrl);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const revokeAll = useCallback(() => {
    closeManualCropDialog();
    setPages((prev) => {
      for (const p of prev) URL.revokeObjectURL(p.previewUrl);
      return [];
    });
    setSelectedId(null);
  }, [closeManualCropDialog]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraPreviewRatio(null);
    setCameraOn(false);
    setCameraError(null);
  }, []);

  const syncCameraPreviewAspect = useCallback(() => {
    const v = videoRef.current;
    if (!v?.videoWidth || !v?.videoHeight) return;
    setCameraPreviewRatio({ w: v.videoWidth, h: v.videoHeight });
  }, []);

  useEffect(() => {
    if (!cameraOn) return;
    const onResize = () => syncCameraPreviewAspect();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [cameraOn, syncCameraPreviewAspect]);

  /** Video hanya ada di DOM saat `cameraOn`; sambungkan stream setelah mount. */
  useEffect(() => {
    if (!cameraOn) return;
    const stream = streamRef.current;
    const video = videoRef.current;
    if (!stream || !video) return;
    video.srcObject = stream;
    void video.play().catch(() => {
      setCameraError("Tidak bisa memutar pratinjau kamera. Coba tutup tab lain yang memakai kamera.");
    });
  }, [cameraOn]);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Peramban tidak mendukung akses kamera.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
    } catch {
      setCameraError("Tidak bisa membuka kamera. Periksa izin perangkat.");
    }
  }, [stopCamera]);

  const addPage = useCallback(async (blob: Blob) => {
    setProcessing(true);
    setCameraError(null);
    try {
      const rawJpegBlob = await blobToJpeg(blob);
      let baseBlob = rawJpegBlob;
      let docDetected = false;
      if (autoCropRef.current) {
        try {
          const extracted = await extractDocumentJpeg(rawJpegBlob);
          if (extracted) {
            baseBlob = extracted;
            docDetected = true;
          }
        } catch {
          /* tetap pakai gambar penuh */
        }
      }
      const filter: ScanFilterId = "auto";
      const jpegBlob = await applyScanFilterToJpeg(baseBlob, filter);
      const previewUrl = URL.createObjectURL(jpegBlob);
      const id = crypto.randomUUID();
      setPages((prev) => [
        ...prev,
        { id, previewUrl, jpegBlob, rawJpegBlob, baseBlob, filter, docDetected, manualCrop: false },
      ]);
      setSelectedId(id);
    } catch {
      setCameraError("Gagal memproses gambar. Coba gambar lain atau matikan auto crop.");
    } finally {
      setProcessing(false);
    }
  }, []);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;
    for (const file of list) {
      if (!file.type.startsWith("image/")) continue;
      try {
        await addPage(file);
      } catch {
        setCameraError(`Gagal memproses: ${file.name}`);
      }
    }
    e.target.value = "";
  };

  const captureFrame = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        try {
          await addPage(blob);
          stopCamera();
        } catch {
          setCameraError("Gagal menyimpan foto dari kamera.");
        }
      },
      "image/jpeg",
      0.92,
    );
  };

  const removePage = (id: string) => {
    setPages((prev) => {
      const p = prev.find((x) => x.id === id);
      if (p) URL.revokeObjectURL(p.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const updatePageFilter = useCallback(async (id: string, filter: ScanFilterId) => {
    const page = pagesRef.current.find((p) => p.id === id);
    if (!page || page.filter === filter) return;
    setProcessing(true);
    setCameraError(null);
    try {
      const jpegBlob = await applyScanFilterToJpeg(page.baseBlob, filter);
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          URL.revokeObjectURL(p.previewUrl);
          return {
            ...p,
            filter,
            jpegBlob,
            previewUrl: URL.createObjectURL(jpegBlob),
          };
        }),
      );
    } catch {
      setCameraError("Gagal menerapkan filter.");
    } finally {
      setProcessing(false);
    }
  }, []);

  const reprocessActivePage = useCallback(async () => {
    const id = selectedId ?? pagesRef.current[0]?.id;
    if (!id) return;
    const page = pagesRef.current.find((p) => p.id === id);
    if (!page) return;
    setProcessing(true);
    setCameraError(null);
    try {
      let baseBlob = page.rawJpegBlob;
      let docDetected = false;
      if (autoCropRef.current) {
        try {
          const extracted = await extractDocumentJpeg(page.rawJpegBlob);
          if (extracted) {
            baseBlob = extracted;
            docDetected = true;
          }
        } catch {
          /* gunakan penuh */
        }
      }
      const jpegBlob = await applyScanFilterToJpeg(baseBlob, page.filter);
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          URL.revokeObjectURL(p.previewUrl);
          return {
            ...p,
            baseBlob,
            docDetected,
            manualCrop: false,
            jpegBlob,
            previewUrl: URL.createObjectURL(jpegBlob),
          };
        }),
      );
    } catch {
      setCameraError("Gagal memproses ulang halaman.");
    } finally {
      setProcessing(false);
    }
  }, [selectedId]);

  const applyManualCrop = useCallback(
    async (rect: { sx: number; sy: number; sw: number; sh: number }) => {
      const id = manualCropTargetId;
      if (!id) return;
      const page = pagesRef.current.find((p) => p.id === id);
      if (!page) return;
      setProcessing(true);
      setCameraError(null);
      try {
        const baseBlob = await cropJpegBlob(page.rawJpegBlob, rect);
        const jpegBlob = await applyScanFilterToJpeg(baseBlob, page.filter);
        setPages((prev) =>
          prev.map((p) => {
            if (p.id !== id) return p;
            URL.revokeObjectURL(p.previewUrl);
            return {
              ...p,
              baseBlob,
              docDetected: false,
              manualCrop: true,
              jpegBlob,
              previewUrl: URL.createObjectURL(jpegBlob),
            };
          }),
        );
        closeManualCropDialog();
      } catch {
        setCameraError("Gagal menerapkan crop manual.");
      } finally {
        setProcessing(false);
      }
    },
    [manualCropTargetId, closeManualCropDialog],
  );

  const move = (id: string, dir: -1 | 1) => {
    setPages((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const exportPdf = async () => {
    if (pages.length === 0) return;
    setExporting(true);
    setCameraError(null);
    try {
      const buffers: Uint8Array[] = [];
      for (const p of pages) {
        const buf = new Uint8Array(await p.jpegBlob.arrayBuffer());
        buffers.push(buf);
      }
      const pdfBytes = await buildScanPdfFromJpegs(buffers);
      downloadBytes(pdfBytes, `scandify-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch {
      setCameraError("Gagal membuat PDF. Coba lagi atau kurangi jumlah halaman.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      {manualCropObjectUrl && manualCropTargetId ? (
        <ManualCropDialog
          key={manualCropTargetId}
          imageUrl={manualCropObjectUrl}
          onClose={closeManualCropDialog}
          onApply={(rect) => void applyManualCrop(rect)}
        />
      ) : null}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Scanner</h1>
          <Badge variant="secondary" className="rounded-full">
            Beta lokal
          </Badge>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Unggah atau foto dokumen: deteksi kertas dan koreksi perspektif otomatis, lalu pilih filter tampilan
          seperti scanner aplikasi. Semua pemrosesan di peramban Anda; urutan halaman bisa diatur sebelum
          unduh PDF.
        </p>
      </div>

      {cameraError ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {cameraError}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <Card className="h-fit border-border/80 bg-card/80 shadow-sm lg:sticky lg:top-24">
          <CardHeader className="gap-1 pb-3">
            <CardTitle className="text-base">Halaman</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {pages.length === 0 ? "Belum ada gambar." : `${pages.length} halaman`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 px-3 sm:px-6">
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              multiple
              disabled={processing}
              className="sr-only"
              onChange={onFiles}
            />
            <label
              htmlFor={fileInputId}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "inline-flex w-full cursor-pointer items-center justify-start gap-2",
                processing && "pointer-events-none opacity-50",
              )}
            >
              <ImagePlus className="size-4" aria-hidden />
              Unggah gambar
            </label>

            <Separator className="bg-border/80" />

            {processing ? (
              <p className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-2 py-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
                Memproses gambar…
              </p>
            ) : null}

            <div className="rounded-lg border border-border/60 bg-muted/15 p-2.5">
              <p className="text-xs font-medium text-foreground">Auto crop kertas</p>
              <p className="mt-1 text-[0.65rem] leading-snug text-muted-foreground">
                Mendeteksi tepi dokumen dan meluruskan sudut pandang. Halaman yang sudah ada bisa diproses
                ulang dari pratinjau kanan.
              </p>
              <Button
                type="button"
                variant={autoCropEnabled ? "secondary" : "outline"}
                size="sm"
                className="mt-2 h-7 w-full text-xs"
                disabled={processing}
                onClick={() => setAutoCropEnabled((v) => !v)}
                aria-pressed={autoCropEnabled}
              >
                {autoCropEnabled ? "Aktif untuk halaman baru" : "Nonaktif untuk halaman baru"}
              </Button>
            </div>

            <Separator className="bg-border/80" />

            {!cameraOn ? (
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={startCamera}
                disabled={processing}
              >
                <Camera className="size-4" aria-hidden />
                Aktifkan kamera
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-muted-foreground"
                  onClick={stopCamera}
                >
                  <VideoOff className="size-4" aria-hidden />
                  Matikan kamera
                </Button>
              </div>
            )}

            {pages.length > 0 ? (
              <>
                <Separator className="bg-border/80" />
                <Button variant="ghost" className="w-full text-muted-foreground" onClick={revokeAll}>
                  Kosongkan semua
                </Button>
              </>
            ) : null}

            <ul className="max-h-[min(50vh,22rem)] space-y-2 overflow-y-auto pt-1">
              {pages.map((p, idx) => (
                <li key={p.id}>
                  <div
                    role="presentation"
                    onClick={() => setSelectedId(p.id)}
                    className={cn(
                      "flex w-full cursor-pointer gap-2 rounded-lg border p-1.5 text-left transition-colors",
                      p.id === activePage?.id
                        ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/80 bg-muted/20 hover:bg-muted/40",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.previewUrl}
                      alt=""
                      className="size-12 shrink-0 rounded-md object-cover"
                    />
                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                      <span className="flex flex-wrap items-center gap-1">
                        <span className="truncate text-xs font-medium text-foreground">
                          Halaman {idx + 1}
                        </span>
                        {p.docDetected ? (
                          <Badge variant="outline" className="h-4 px-1 text-[0.6rem] font-normal">
                            Kertas
                          </Badge>
                        ) : null}
                        {p.manualCrop ? (
                          <Badge variant="outline" className="h-4 px-1 text-[0.6rem] font-normal">
                            Manual
                          </Badge>
                        ) : null}
                      </span>
                      <span className="flex flex-wrap gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="size-7"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            move(p.id, -1);
                          }}
                          aria-label="Naikkan"
                        >
                          <ArrowUp className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="size-7"
                          disabled={idx === pages.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            move(p.id, 1);
                          }}
                          aria-label="Turunkan"
                        >
                          <ArrowDown className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="size-7 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePage(p.id);
                          }}
                          aria-label="Hapus halaman"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex min-h-0 flex-col gap-6">
          {cameraOn ? (
            <Card className="overflow-hidden border-border/80 bg-card/80 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pratinjau kamera</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Pegang dokumen stabil; tombol besar di bawah pratinjau menambah halaman.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div
                  className="relative w-full overflow-hidden bg-black"
                  style={{
                    aspectRatio: cameraPreviewRatio
                      ? `${cameraPreviewRatio.w} / ${cameraPreviewRatio.h}`
                      : "9 / 16",
                  }}
                >
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    playsInline
                    muted
                    autoPlay
                    onLoadedMetadata={syncCameraPreviewAspect}
                    onResize={syncCameraPreviewAspect}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/75 via-black/30 to-transparent px-4 pt-20 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
                    <Button
                      type="button"
                      size="lg"
                      className="pointer-events-auto h-14 min-h-14 touch-manipulation gap-2 rounded-full px-10 text-base shadow-lg sm:h-16 sm:min-h-16 sm:px-12 sm:text-lg"
                      onClick={() => void captureFrame()}
                      disabled={processing}
                      aria-label="Ambil foto"
                    >
                      <Camera className="size-6 shrink-0 sm:size-7" aria-hidden />
                      Ambil foto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card className="min-h-[12rem] flex-1 border-border/80 bg-card/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pratinjau halaman</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Pilih halaman di daftar kiri untuk melihat ukuran penuh.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex min-h-[min(60vh,28rem)] flex-col gap-3 rounded-b-xl bg-muted/15 p-4">
              {activePage ? (
                <>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">Filter tampilan</p>
                      <p className="text-[0.65rem] text-muted-foreground">
                        {activePage.manualCrop
                          ? "Crop manual aktif; crop ulang memakai auto crop dari gambar asli."
                          : activePage.docDetected
                            ? "Kertas terdeteksi; Anda bisa mengganti gaya di bawah."
                            : "Tidak ada crop otomatis; gunakan crop manual atau crop ulang."}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        disabled={processing}
                        onClick={openManualCrop}
                      >
                        <Crop className="size-3.5" aria-hidden />
                        Crop manual
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 text-xs"
                        disabled={processing}
                        onClick={() => void reprocessActivePage()}
                      >
                        <RefreshCw className="size-3.5" aria-hidden />
                        Crop &amp; filter ulang
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SCAN_FILTER_OPTIONS.map((opt) => (
                      <Button
                        key={opt.id}
                        type="button"
                        size="sm"
                        variant={activePage.filter === opt.id ? "secondary" : "outline"}
                        className="h-8 rounded-full px-3 text-xs"
                        disabled={processing}
                        title={opt.hint}
                        onClick={() => void updatePageFilter(activePage.id, opt.id)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activePage.previewUrl}
                      alt="Pratinjau halaman"
                      className="max-h-[min(55vh,26rem)] w-auto max-w-full rounded-lg object-contain shadow-md ring-1 ring-border/60"
                    />
                  </div>
                </>
              ) : (
                <p className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
                  Unggah gambar atau ambil foto untuk mulai.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/10 sm:flex-row sm:justify-end">
              <Button
                size="lg"
                className="w-full rounded-full sm:w-auto sm:min-w-[200px]"
                disabled={pages.length === 0 || exporting || processing}
                onClick={exportPdf}
              >
                <FileDown className="size-4" aria-hidden />
                {exporting ? "Membuat PDF…" : "Unduh PDF"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
