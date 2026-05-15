"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function LandingHeroBackdrop() {
  /** Hanya matikan animasi saat preferensi aksesibilitas benar-benar aktif (bukan `null` saat SSR). */
  const reduceMotion = useReducedMotion() === true;

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Soft base wash */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/[0.07] via-transparent to-accent-muted/[0.06] dark:from-primary/[0.12] dark:to-accent-muted/[0.08]" />

      {/* Slow aurora / mesh spin */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[160%] min-h-[48rem] w-[160%] min-w-[48rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.55] dark:opacity-40"
        style={{
          background:
            "conic-gradient(from 200deg at 50% 45%, oklch(0.52 0.19 160 / 0.14), transparent 28%, oklch(0.72 0.12 200 / 0.08), transparent 52%, oklch(0.55 0.14 145 / 0.1), transparent 78%)",
        }}
        animate={reduceMotion ? undefined : { rotate: [0, 360] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 72, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
        }
      />

      {/* Primary glow orb */}
      <motion.div
        className="absolute -left-40 top-[-10%] h-[min(100vw,30rem)] w-[min(100vw,30rem)] rounded-full bg-primary/22 blur-[100px] dark:bg-primary/28"
        animate={
          reduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : {
                x: [0, 32, -8, 0],
                y: [0, 22, 10, 0],
                scale: [1, 1.08, 1.04, 1],
              }
        }
        transition={{
          duration: 16,
          repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      {/* Accent orb */}
      <motion.div
        className="absolute -right-32 top-[18%] h-[min(92vw,26rem)] w-[min(92vw,26rem)] rounded-full bg-accent-muted/85 blur-[92px] dark:bg-accent-muted/45"
        animate={
          reduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : {
                x: [0, -28, 8, 0],
                y: [0, 32, 12, 0],
                scale: [1, 1.1, 1.02, 1],
              }
        }
        transition={{
          duration: 20,
          repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
      {/* Deep bottom accent */}
      <motion.div
        className="absolute -bottom-24 left-[18%] h-[min(85vw,22rem)] w-[min(85vw,22rem)] rounded-full bg-primary/12 blur-[88px] dark:bg-accent-muted/25"
        animate={
          reduceMotion
            ? { x: 0, y: 0, opacity: 0.88 }
            : {
                x: [0, 18, -14, 0],
                y: [0, -16, 6, 0],
                opacity: [0.75, 1, 0.85, 0.75],
              }
        }
        transition={{
          duration: 22,
          repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />

      {/* Diagonal light shimmer */}
      <div
        className={cn(
          "absolute inset-0 mix-blend-soft-light dark:mix-blend-plus-lighter",
          !reduceMotion && "animate-[landing-hero-shimmer_14s_ease-in-out_infinite]",
        )}
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, oklch(0.99 0 0 / 0.06) 48%, oklch(0.52 0.19 160 / 0.08) 52%, transparent 65%)",
        }}
      />

      {/* Drifting grid */}
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(to_right,rgb(24_24_27/0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgb(24_24_27/0.055)_1px,transparent_1px)] bg-size-[52px_52px] mask-[radial-gradient(ellipse_75%_60%_at_50%_-8%,#000_45%,transparent)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.045)_1px,transparent_1px)]",
          !reduceMotion &&
            "motion-safe:animate-[landing-hero-grid-drift_22s_ease-in-out_infinite]",
        )}
      />

      {/* Subtle scan-line wash (on-brand) */}
      {!reduceMotion ? (
        <div className="absolute inset-0 overflow-hidden opacity-70 mask-[radial-gradient(ellipse_80%_65%_at_50%_40%,#000_30%,transparent_75%)]">
          <div
            className="absolute inset-x-0 top-0 h-[180%] animate-[landing-hero-scan-sweep_11s_ease-in-out_infinite] bg-[repeating-linear-gradient(180deg,transparent_0px,transparent_10px,oklch(0.52_0.19_160/0.04)_10px,oklch(0.52_0.19_160/0.04)_11px)] dark:bg-[repeating-linear-gradient(180deg,transparent_0px,transparent_10px,oklch(0.62_0.17_160/0.055)_10px,oklch(0.62_0.17_160/0.055)_11px)]"
            style={{ animationDelay: "2s" }}
          />
        </div>
      ) : null}

      {/* Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_0%,transparent_40%,var(--background)_100%)] opacity-50 dark:opacity-70" />
    </div>
  );
}

export function LandingHeroStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("flex flex-col items-center text-center", className)}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.11, delayChildren: 0.06 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function LandingMotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.58, ease: easeOut },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LandingScrollReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px", amount: 0.25 }}
      transition={{ duration: 0.55, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function LandingStaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-48px", amount: 0.15 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.1, delayChildren: 0.05 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function LandingStaggerChild({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.48, ease: easeOut },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LandingMotionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 420, damping: 22 },
      }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      {children}
    </motion.div>
  );
}

export function LandingPressable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 26 }}
    >
      {children}
    </motion.span>
  );
}

/** Hero section shell: subtle radial highlight follows pointer without blocking controls. */
export function LandingHeroInteractiveSection({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.35);
  const sx = useSpring(mx, { stiffness: 140, damping: 30, mass: 0.35 });
  const sy = useSpring(my, { stiffness: 140, damping: 30, mass: 0.35 });
  const spotlight = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(520px circle at ${(x as number) * 100}% ${(y as number) * 100}%, oklch(0.52 0.19 160 / 0.12), transparent 58%)`,
  );

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(Math.min(1, Math.max(0, px)));
    my.set(Math.min(1, Math.max(0, py)));
  }

  function onPointerLeave() {
    mx.set(0.5);
    my.set(0.32);
  }

  return (
    <motion.section
      ref={ref}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{ background: spotlight }}
      />
      {children}
    </motion.section>
  );
}
