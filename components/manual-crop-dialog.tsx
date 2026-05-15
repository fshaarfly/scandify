"use client";

import { Crop } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuadCropPixels } from "@/lib/homography-warp-jpeg";

type Pt = { x: number; y: number };
/** TL, TR, BR, BL — koordinat normalisasi [0,1] relatif ke bitmap. */
export type NormQuad = readonly [Pt, Pt, Pt, Pt];

type DisplayMetrics = {
  left: number;
  top: number;
  dw: number;
  dh: number;
};

type LayoutBox = {
  W: number;
  H: number;
  ox: number;
  oy: number;
  dw: number;
  dh: number;
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

const INITIAL_QUAD: NormQuad = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
];

function cloneQuad(q: NormQuad): NormQuad {
  return q.map((p) => ({ ...p })) as unknown as NormQuad;
}

/** Geser seluruh segi empat agar masuk [0,1]² (hanya translasi). */
function translateQuadToFit(pts: readonly Pt[]): NormQuad {
  const w = pts.map((p) => ({ ...p }));
  const bbox = () => {
    const xs = w.map((p) => p.x);
    const ys = w.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  };
  for (let iter = 0; iter < 16; iter++) {
    const { minX, maxX, minY, maxY } = bbox();
    let dx = 0;
    let dy = 0;
    if (minX < 0) dx = -minX;
    else if (maxX > 1) dx = 1 - maxX;
    if (minY < 0) dy = -minY;
    else if (maxY > 1) dy = 1 - maxY;
    if (dx === 0 && dy === 0) break;
    for (const p of w) {
      p.x += dx;
      p.y += dy;
    }
  }
  const { minX, maxX, minY, maxY } = bbox();
  if (minX < 0 || maxX > 1 || minY < 0 || maxY > 1) {
    for (const p of w) {
      p.x = clamp01(p.x);
      p.y = clamp01(p.y);
    }
  }
  return [w[0]!, w[1]!, w[2]!, w[3]!];
}

type DragState =
  | null
  | {
      kind: "move" | "tl" | "tr" | "bl" | "br";
      u0: number;
      v0: number;
      quad0: NormQuad;
    };

type ManualCropDialogProps = {
  imageUrl: string;
  onClose: () => void;
  onApply: (crop: QuadCropPixels) => void;
};

const CORNER_INDEX: Record<Exclude<NonNullable<DragState>["kind"], "move">, 0 | 1 | 2 | 3> = {
  tl: 0,
  tr: 1,
  br: 2,
  bl: 3,
};

export function ManualCropDialog({ imageUrl, onClose, onApply }: ManualCropDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const titleId = useId();
  const [quad, setQuad] = useState<NormQuad>(() => cloneQuad(INITIAL_QUAD));
  const [layoutTick, setLayoutTick] = useState(0);
  const [layoutBox, setLayoutBox] = useState<LayoutBox | null>(null);
  const metricsRef = useRef<DisplayMetrics | null>(null);
  const quadRef = useRef(quad);
  const dragRef = useRef<DragState>(null);
  const dragListenersRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    quadRef.current = quad;
  }, [quad]);

  const resetQuad = useCallback(() => {
    setQuad(cloneQuad(INITIAL_QUAD));
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
      setLayoutBox(null);
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
    setLayoutBox({ W, H, ox, oy, dw, dh });
  }, [imageUrl, layoutTick]);

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

  const applyPointerDrag = useCallback((e: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const m = metricsRef.current;
    if (!m) return;
    const { u, v } = clientToNorm(e.clientX, e.clientY, m);
    const du = u - drag.u0;
    const dv = v - drag.v0;
    const { kind, quad0 } = drag;

    if (kind === "move") {
      const moved = quad0.map((p) => ({ x: p.x + du, y: p.y + dv })) as unknown as NormQuad;
      setQuad(translateQuadToFit(moved));
      return;
    }

    const idx = CORNER_INDEX[kind];
    setQuad(
      quad0.map((p, j) =>
        j === idx ? { x: clamp01(p.x + du), y: clamp01(p.y + dv) } : { ...p },
      ) as unknown as NormQuad,
    );
  }, []);

  const endDrag = useCallback(() => {
    dragListenersRef.current?.();
    dragListenersRef.current = null;
    dragRef.current = null;
  }, []);

  useEffect(
    () => () => {
      dragListenersRef.current?.();
      dragListenersRef.current = null;
      dragRef.current = null;
    },
    [],
  );

  const startDrag = (kind: NonNullable<DragState>["kind"], e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragRef.current) return;
    refreshMetrics();
    const m = metricsRef.current;
    if (!m) return;
    const { u, v } = clientToNorm(e.clientX, e.clientY, m);
    dragRef.current = { kind, u0: u, v0: v, quad0: cloneQuad(quadRef.current) };

    const target = e.currentTarget;
    if (target instanceof HTMLElement) {
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }

    const onMove = (ev: PointerEvent) => {
      ev.preventDefault();
      applyPointerDrag(ev);
    };
    const onEnd = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      if (target instanceof HTMLElement) {
        try {
          target.releasePointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      }
      endDrag();
    };

    window.addEventListener("pointermove", onMove, { capture: true, passive: false });
    window.addEventListener("pointerup", onEnd, { capture: true });
    window.addEventListener("pointercancel", onEnd, { capture: true });

    dragListenersRef.current = () => {
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("pointerup", onEnd, { capture: true });
      window.removeEventListener("pointercancel", onEnd, { capture: true });
    };
  };

  const handleApply = () => {
    const img = imgRef.current;
    if (!img?.naturalWidth) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const q = quadRef.current;
    const crop: QuadCropPixels = {
      tl: { x: q[0]!.x * nw, y: q[0]!.y * nh },
      tr: { x: q[1]!.x * nw, y: q[1]!.y * nh },
      br: { x: q[2]!.x * nw, y: q[2]!.y * nh },
      bl: { x: q[3]!.x * nw, y: q[3]!.y * nh },
    };
    onApply(crop);
  };

  const handleBtnCls =
    "pointer-events-auto absolute z-20 flex h-11 w-11 min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-none items-center justify-center rounded-full border-2 border-primary bg-background/95 shadow-md";

  const b = layoutBox;
  const pts = b ? [...quad] : [];
  const polyPx = b
    ? pts.map((c) => `${b.ox + c.x * b.dw},${b.oy + c.y * b.dh}`).join(" ")
    : "";
  const dimPath =
    b && pts.length === 4
      ? (() => {
          const px = (c: (typeof pts)[0]) => `${b.ox + c.x * b.dw} ${b.oy + c.y * b.dh}`;
          const [c0, c1, c2, c3] = pts;
          const inner = `M ${px(c0!)} L ${px(c1!)} L ${px(c2!)} L ${px(c3!)} Z`;
          return `M 0 0 L ${b.W} 0 L ${b.W} ${b.H} L 0 ${b.H} Z ${inner}`;
        })()
      : "";

  const cornerStyle = (c: { x: number; y: number }) =>
    b
      ? ({
          left: `${b.ox + c.x * b.dw}px`,
          top: `${b.oy + c.y * b.dh}px`,
        } as const)
      : {};

  const [tl, tr, br, bl] = quad;

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
                Empat sudut bebas: setiap sudut hanya menggeser titik itu. Seret bagian dalam untuk memindahkan
                seluruh area. Hasil diluruskan dengan koreksi perspektif. Koordinat dari gambar asli (sebelum
                auto crop).
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 [scrollbar-gutter:stable] sm:px-5">
          <div className="mb-2 flex justify-end">
            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={resetQuad}>
              Atur ulang ke seluruh gambar
            </Button>
          </div>
          <div className="flex w-full min-w-0 justify-center rounded-lg bg-muted/40 py-2 ring-1 ring-border/60">
            <div className="relative inline-block max-h-[min(60vh,480px)] w-full max-w-full min-w-0 touch-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageUrl}
                alt=""
                draggable={false}
                className="block max-h-[min(60vh,480px)] max-w-full touch-none object-contain select-none"
                onContextMenu={(ev) => ev.preventDefault()}
                onLoad={() => {
                  requestAnimationFrame(() => refreshMetrics());
                }}
              />
              {b && polyPx ? (
                <svg className="absolute inset-0" width={b.W} height={b.H} aria-hidden>
                  <path
                    d={dimPath}
                    fill="rgba(0,0,0,0.5)"
                    fillRule="evenodd"
                    pointerEvents="none"
                  />
                  <polygon
                    points={polyPx}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                    pointerEvents="none"
                  />
                  <polygon
                    points={polyPx}
                    fill="rgba(255,255,255,0.02)"
                    className="cursor-grab touch-none active:cursor-grabbing"
                    onPointerDown={(e) => startDrag("move", e)}
                  />
                </svg>
              ) : null}
              {b ? (
                <>
                  <button
                    type="button"
                    aria-label="Seret sudut kiri atas"
                    className={cn(handleBtnCls, "cursor-move")}
                    style={cornerStyle(tl)}
                    onPointerDown={(e) => startDrag("tl", e)}
                  >
                    <span className="pointer-events-none size-2.5 rounded-sm bg-primary shadow-sm" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Seret sudut kanan atas"
                    className={cn(handleBtnCls, "cursor-move")}
                    style={cornerStyle(tr)}
                    onPointerDown={(e) => startDrag("tr", e)}
                  >
                    <span className="pointer-events-none size-2.5 rounded-sm bg-primary shadow-sm" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Seret sudut kiri bawah"
                    className={cn(handleBtnCls, "cursor-move")}
                    style={cornerStyle(bl)}
                    onPointerDown={(e) => startDrag("bl", e)}
                  >
                    <span className="pointer-events-none size-2.5 rounded-sm bg-primary shadow-sm" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Seret sudut kanan bawah"
                    className={cn(handleBtnCls, "cursor-move")}
                    style={cornerStyle(br)}
                    onPointerDown={(e) => startDrag("br", e)}
                  >
                    <span className="pointer-events-none size-2.5 rounded-sm bg-primary shadow-sm" aria-hidden />
                  </button>
                </>
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
