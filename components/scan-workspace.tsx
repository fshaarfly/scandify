"use client";

import {
  ArrowDown,
  ArrowUp,
  Camera,
  FileDown,
  ImagePlus,
  Trash2,
  VideoOff,
} from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { buildScanPdfFromJpegs } from "@/lib/build-scan-pdf";
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
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pagesRef = useRef<ScanPage[]>([]);

  const activePage = useMemo(() => {
    if (pages.length === 0) return null;
    const match = selectedId ? pages.find((p) => p.id === selectedId) : undefined;
    return match ?? pages[0] ?? null;
  }, [pages, selectedId]);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  useEffect(() => {
    return () => {
      for (const p of pagesRef.current) URL.revokeObjectURL(p.previewUrl);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const revokeAll = useCallback(() => {
    setPages((prev) => {
      for (const p of prev) URL.revokeObjectURL(p.previewUrl);
      return [];
    });
    setSelectedId(null);
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
    setCameraError(null);
  }, []);

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
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
      setCameraOn(true);
    } catch {
      setCameraError("Tidak bisa membuka kamera. Periksa izin perangkat.");
    }
  }, [stopCamera]);

  const addPage = useCallback(async (blob: Blob) => {
    const jpegBlob = await blobToJpeg(blob);
    const previewUrl = URL.createObjectURL(jpegBlob);
    const id = crypto.randomUUID();
    setPages((prev) => [...prev, { id, previewUrl, jpegBlob }]);
    setSelectedId(id);
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
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Scanner</h1>
          <Badge variant="secondary" className="rounded-full">
            Beta lokal
          </Badge>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Tambah halaman dari galeri atau kamera, atur urutan, lalu unduh PDF. Koreksi perspektif
          otomatis menyusul — saat ini ekspor memakai gambar yang Anda unggah.
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
              className="sr-only"
              onChange={onFiles}
            />
            <label
              htmlFor={fileInputId}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "inline-flex w-full cursor-pointer items-center justify-start gap-2",
              )}
            >
              <ImagePlus className="size-4" aria-hidden />
              Unggah gambar
            </label>

            <Separator className="bg-border/80" />

            {!cameraOn ? (
              <Button variant="outline" className="w-full justify-start gap-2" onClick={startCamera}>
                <Camera className="size-4" aria-hidden />
                Aktifkan kamera
              </Button>
            ) : (
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={captureFrame}>
                  <Camera className="size-4" aria-hidden />
                  Ambil foto
                </Button>
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
                      <span className="truncate text-xs font-medium text-foreground">
                        Halaman {idx + 1}
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
                  Pegang dokumen stabil; tekan &quot;Ambil foto&quot; untuk menambah halaman.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <video
                  ref={videoRef}
                  className="aspect-video w-full bg-black object-cover"
                  playsInline
                  muted
                  autoPlay
                />
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
            <CardContent className="flex min-h-[min(60vh,28rem)] items-center justify-center rounded-b-xl bg-muted/15 p-4">
              {activePage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activePage.previewUrl}
                  alt={`Pratinjau halaman`}
                  className="max-h-[min(60vh,28rem)] w-auto max-w-full rounded-lg object-contain shadow-md ring-1 ring-border/60"
                />
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Unggah gambar atau ambil foto untuk mulai.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/10 sm:flex-row sm:justify-end">
              <Button
                size="lg"
                className="w-full rounded-full sm:w-auto sm:min-w-[200px]"
                disabled={pages.length === 0 || exporting}
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
