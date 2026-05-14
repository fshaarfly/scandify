"use client";

import { Crop } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NormCrop = { x: number; y: number; w: number; h: number };

type DisplayMetrics = {
  left: number;
  top: number;
  dw: number;
  dh: number;
};

type OverlayBox = {
  W: number;
  H: number;
  ox: number;
  oy: number;
  dw: number;
  dh: number;
  left: number;
  top: number;
  cw: number;
  ch: number;
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function computeContentRect(img: HTMLImageElement): DisplayMetrics | null {
  const rect = img.getBoundingClientRect();
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh || !rect.width || !rect.height) return null;
  const scale = Math.min(rect.width / nw, rect.height / nh);
  const dw = nw * scale;
  const dh = nh * scale;
  const left = rect.left + (rect.width - dw) / 2;
  const top = rect.top + (rect.height - dh) / 2;
  return { left, top, dw, dh };
}

function clientToNorm(clientX: number, clientY: number, m: DisplayMetrics) {
  const u = (clientX - m.left) / m.dw;
  const v = (clientY - m.top) / m.dh;
  return { u: clamp01(u), v: clamp01(v) };
}

function normToPixels(c: NormCrop, nw: number, nh: number) {
  const sx = Math.round(c.x * nw);
  const sy = Math.round(c.y * nh);
  const sw = Math.max(1, Math.round(c.w * nw));
  const sh = Math.max(1, Math.round(c.h * nh));
  return { sx, sy, sw, sh };
}

const MIN_FRAC = 0.04;

type DragState =
  | null
  | {
      kind: "move" | "nw" | "ne" | "sw" | "se";
      u0: number;
      v0: number;
      crop0: NormCrop;
    };

type ManualCropDialogProps = {
  imageUrl: string;
  onClose: () => void;
  onApply: (rect: { sx: number; sy: number; sw: number; sh: number }) => void;
};

export function ManualCropDialog({ imageUrl, onClose, onApply }: ManualCropDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const titleId = useId();
  const [crop, setCrop] = useState<NormCrop>({ x: 0, y: 0, w: 1, h: 1 });
  const [drag, setDrag] = useState<DragState>(null);
  const [layoutTick, setLayoutTick] = useState(0);
  const [overlayBox, setOverlayBox] = useState<OverlayBox | null>(null);
  const metricsRef = useRef<DisplayMetrics | null>(null);
  const cropRef = useRef(crop);

  useEffect(() => {
    cropRef.current = crop;
  }, [crop]);

  const clampCrop = useCallback((c: NormCrop): NormCrop => {
    let { x, y, w, h } = c;
    w = Math.max(MIN_FRAC, Math.min(1, w));
    h = Math.max(MIN_FRAC, Math.min(1, h));
    x = clamp01(x);
    y = clamp01(y);
    if (x + w > 1) x = 1 - w;
    if (y + h > 1) y = 1 - h;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    return { x, y, w, h };
  }, []);

  const refreshMetrics = useCallback(() => {
    const img = imgRef.current;
    if (!img?.naturalWidth) {
      metricsRef.current = null;
      return;
    }
    metricsRef.current = computeContentRect(img);
    setLayoutTick((t) => t + 1);
  }, []);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (!img?.naturalWidth) {
      setOverlayBox(null);
      return;
    }
    const W = img.offsetWidth;
    const H = img.offsetHeight;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const s = Math.min(W / nw, H / nh);
    const dw = nw * s;
    const dh = nh * s;
    const ox = (W - dw) / 2;
    const oy = (H - dh) / 2;
    const left = ox + crop.x * dw;
    const top = oy + crop.y * dh;
    const cw = crop.w * dw;
    const ch = crop.h * dh;
    setOverlayBox({ W, H, ox, oy, dw, dh, left, top, cw, ch });
  }, [crop, imageUrl, layoutTick]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onResize = () => refreshMetrics();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [refreshMetrics]);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!drag) return;
      const m = metricsRef.current;
      if (!m) return;
      const { u, v } = clientToNorm(e.clientX, e.clientY, m);
      const { kind, u0, v0, crop0 } = drag;
      const du = u - u0;
      const dv = v - v0;

      if (kind === "move") {
        setCrop(
          clampCrop({
            x: crop0.x + du,
            y: crop0.y + dv,
            w: crop0.w,
            h: crop0.h,
          }),
        );
        return;
      }

      const fx = crop0.x + crop0.w;
      const fy = crop0.y + crop0.h;

      if (kind === "se") {
        setCrop(
          clampCrop({
            x: crop0.x,
            y: crop0.y,
            w: Math.max(MIN_FRAC, u - crop0.x),
            h: Math.max(MIN_FRAC, v - crop0.y),
          }),
        );
      } else if (kind === "nw") {
        const nx = Math.min(u, fx - MIN_FRAC);
        const ny = Math.min(v, fy - MIN_FRAC);
        setCrop(
          clampCrop({
            x: nx,
            y: ny,
            w: fx - nx,
            h: fy - ny,
          }),
        );
      } else if (kind === "ne") {
        const ny = Math.min(v, fy - MIN_FRAC);
        setCrop(
          clampCrop({
            x: crop0.x,
            y: ny,
            w: Math.max(MIN_FRAC, u - crop0.x),
            h: fy - ny,
          }),
        );
      } else if (kind === "sw") {
        const nx = Math.min(u, fx - MIN_FRAC);
        setCrop(
          clampCrop({
            x: nx,
            y: crop0.y,
            w: fx - nx,
            h: Math.max(MIN_FRAC, v - crop0.y),
          }),
        );
      }
    },
    [drag, clampCrop],
  );

  const endDrag = useCallback(() => {
    setDrag(null);
  }, []);

  useEffect(() => {
    if (!drag) return;
    const up = () => endDrag();
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [drag, onPointerMove, endDrag]);

  const startDrag = (kind: NonNullable<DragState>["kind"], e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    refreshMetrics();
    const m = metricsRef.current;
    if (!m) return;
    const { u, v } = clientToNorm(e.clientX, e.clientY, m);
    setDrag({ kind, u0: u, v0: v, crop0: { ...cropRef.current } });
  };

  const handleApply = () => {
    const img = imgRef.current;
    if (!img?.naturalWidth) return;
    const { sx, sy, sw, sh } = normToPixels(crop, img.naturalWidth, img.naturalHeight);
    onApply({ sx, sy, sw, sh });
  };

  const handleCls =
    "absolute z-20 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-primary bg-background shadow touch-manipulation";

  const b = overlayBox;

  const modal = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Tutup crop manual"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative z-[1] flex max-h-[90vh] w-[min(96vw,42rem)] flex-col overflow-hidden rounded-xl border border-border bg-card p-0 text-foreground shadow-lg outline-none",
        )}
        onPointerDown={(e) => e.stopPropagation()}
      >
      <div className="flex flex-col gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
        <div className="flex items-start gap-2">
          <Crop className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <h2 id={titleId} className="text-sm font-semibold tracking-tight">
              Crop manual
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Seret sudut atau tengah area untuk menyesuaikan. Area diambil dari gambar asli (sebelum auto
              crop).
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 py-3 sm:px-5">
        <div className="flex justify-center rounded-lg bg-muted/40 py-2 ring-1 ring-border/60">
          <div className="relative inline-block max-h-[min(60vh,480px)] max-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageUrl}
              alt=""
              draggable={false}
              className="block max-h-[min(60vh,480px)] max-w-full object-contain select-none"
              onLoad={() => {
                requestAnimationFrame(() => refreshMetrics());
              }}
            />
            {b ? (
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-0 bg-black/50" style={{ height: b.oy }} aria-hidden />
                <div
                  className="absolute inset-x-0 bottom-0 bg-black/50"
                  style={{ height: Math.max(0, b.H - b.oy - b.dh) }}
                  aria-hidden
                />
                <div
                  className="absolute left-0 bg-black/50"
                  style={{ top: b.oy, width: b.ox, height: b.dh }}
                  aria-hidden
                />
                <div
                  className="absolute right-0 bg-black/50"
                  style={{
                    top: b.oy,
                    width: Math.max(0, b.W - b.ox - b.dw),
                    height: b.dh,
                  }}
                  aria-hidden
                />
                <div
                  className="absolute bg-black/50"
                  style={{ left: b.ox, top: b.oy, width: b.dw, height: b.top - b.oy }}
                  aria-hidden
                />
                <div
                  className="absolute bg-black/50"
                  style={{
                    left: b.ox,
                    top: b.top + b.ch,
                    width: b.dw,
                    height: Math.max(0, b.oy + b.dh - b.top - b.ch),
                  }}
                  aria-hidden
                />
                <div
                  className="absolute bg-black/50"
                  style={{
                    left: b.ox,
                    top: b.top,
                    width: Math.max(0, b.left - b.ox),
                    height: b.ch,
                  }}
                  aria-hidden
                />
                <div
                  className="absolute bg-black/50"
                  style={{
                    left: b.left + b.cw,
                    top: b.top,
                    width: Math.max(0, b.ox + b.dw - b.left - b.cw),
                    height: b.ch,
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-auto absolute z-10 cursor-move ring-2 ring-primary"
                  style={{ left: b.left, top: b.top, width: b.cw, height: b.ch }}
                  onPointerDown={(e) => startDrag("move", e)}
                  role="presentation"
                />
                <button
                  type="button"
                  aria-label="Seret sudut kiri atas"
                  className={cn(handleCls, "pointer-events-auto cursor-nwse-resize")}
                  style={{ left: `${b.left}px`, top: `${b.top}px` }}
                  onPointerDown={(e) => startDrag("nw", e)}
                />
                <button
                  type="button"
                  aria-label="Seret sudut kanan atas"
                  className={cn(handleCls, "pointer-events-auto cursor-nesw-resize")}
                  style={{ left: `${b.left + b.cw}px`, top: `${b.top}px` }}
                  onPointerDown={(e) => startDrag("ne", e)}
                />
                <button
                  type="button"
                  aria-label="Seret sudut kiri bawah"
                  className={cn(handleCls, "pointer-events-auto cursor-nesw-resize")}
                  style={{ left: `${b.left}px`, top: `${b.top + b.ch}px` }}
                  onPointerDown={(e) => startDrag("sw", e)}
                />
                <button
                  type="button"
                  aria-label="Seret sudut kanan bawah"
                  className={cn(handleCls, "pointer-events-auto cursor-nwse-resize")}
                  style={{ left: `${b.left + b.cw}px`, top: `${b.top + b.ch}px` }}
                  onPointerDown={(e) => startDrag("se", e)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="button" onClick={handleApply}>
          Terapkan crop
        </Button>
      </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}
