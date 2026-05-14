"use client";

import Image from "next/image";
import { GripVertical } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const BEFORE_SRC = "/demo-before.webp";
const AFTER_SRC = "/demo-after.webp";

type DemoBeforeAfterProps = {
  className?: string;
};

export function DemoBeforeAfter({ className }: DemoBeforeAfterProps) {
  const [pct, setPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const p = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setPct(p);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPct((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPct((p) => Math.min(100, p + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPct(100);
    }
  };

  return (
    <figure className={cn("mx-auto w-full max-w-sm touch-none select-none", className)}>
      <div
        ref={containerRef}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-xl ring-1 ring-border/80"
      >
        <Image
          src={AFTER_SRC}
          alt="Hasil setelah dirapikan"
          fill
          className="pointer-events-none object-cover"
          sizes="(max-width: 640px) 100vw, 384px"
          draggable={false}
          priority
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)` }}
        >
          <Image
            src={BEFORE_SRC}
            alt="Foto asli sebelum dirapikan"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 384px"
            draggable={false}
            priority
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-white/90 shadow-sm"
          style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
          aria-hidden
        />

        <div
          className="absolute inset-0 z-[1] cursor-ew-resize"
          aria-hidden
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        <button
          type="button"
          className="absolute inset-y-0 z-[2] w-10 -translate-x-1/2 cursor-ew-resize touch-manipulation border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          style={{ left: `${pct}%` }}
          aria-label="Geser untuk membandingkan sebelum dan sesudah"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          role="slider"
          onKeyDown={onKeyDown}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            setFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
            setFromClientX(e.clientX);
          }}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-muted-foreground shadow-md ring-1 ring-border/80 backdrop-blur-sm">
            <GripVertical className="size-4" aria-hidden />
          </span>
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between bg-linear-to-t from-black/55 to-transparent px-3 pb-2 pt-10 text-[11px] font-medium text-white sm:text-xs">
          <span>Sebelum</span>
          <span>Sesudah</span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
        Perbandingan foto asli dan hasil rapi. Geser pemisah atau gunakan tombol panah saat fokus pada
        pegangan.
      </figcaption>
    </figure>
  );
}
