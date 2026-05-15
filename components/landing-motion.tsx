"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function LandingHeroBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -left-40 top-[-10%] h-[min(100vw,28rem)] w-[min(100vw,28rem)] rounded-full bg-primary/25 blur-[100px] dark:bg-primary/30"
        animate={{
          x: [0, 24, 0],
          y: [0, 18, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -right-32 top-[20%] h-[min(90vw,24rem)] w-[min(90vw,24rem)] rounded-full bg-accent-muted/90 blur-[90px] dark:bg-accent-muted/50"
        animate={{
          x: [0, -20, 0],
          y: [0, 28, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(24_24_27/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(24_24_27/0.06)_1px,transparent_1px)] bg-size-[52px_52px] mask-[radial-gradient(ellipse_70%_55%_at_50%_-5%,#000_50%,transparent)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)]" />
    </div>
  );
}

export function LandingHeroStagger({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
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
