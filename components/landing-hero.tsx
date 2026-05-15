"use client";

import { motion } from "framer-motion";
import {
  Camera,
  FileDown,
  ScanLine,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { DemoBeforeAfter } from "@/components/demo-before-after";
import {
  LandingHeroBackdrop,
  LandingHeroInteractiveSection,
  LandingHeroStagger,
  LandingMotionItem,
  LandingPressable,
} from "@/components/landing-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const floatEase = [0.45, 0, 0.55, 1] as const;

function HeroFloatingChip({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute z-10 flex items-center gap-1.5 rounded-full border border-border/80 bg-card/90 px-3 py-1.5 text-[11px] font-medium text-foreground shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/40 sm:text-xs",
        className,
      )}
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: floatEase }}
    >
      {children}
    </motion.div>
  );
}

function HeroScanSweep() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden rounded-b-xl"
      aria-hidden
    >
      <motion.div
        className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent shadow-[0_0_20px_var(--color-primary)]"
        initial={{ top: "12%" }}
        animate={{ top: ["12%", "88%", "12%"] }}
        transition={{
          duration: 5.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

const trust = [
  { Icon: Zap, label: "Alur cepat" },
  { Icon: Shield, label: "Privasi jadi prioritas" },
  { Icon: FileDown, label: "Ekspor PDF" },
];

export function LandingHero() {
  return (
    <LandingHeroInteractiveSection className="relative overflow-hidden border-b border-border/80 px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
      <LandingHeroBackdrop />
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-14 xl:gap-16">
          <LandingHeroStagger className="items-center text-center lg:items-start lg:text-left">
            <LandingMotionItem>
              <Badge
                variant="secondary"
                className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/80 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm"
              >
                <Sparkles className="size-3" aria-hidden />
                Scan dokumen di browser
              </Badge>
            </LandingMotionItem>
            <LandingMotionItem>
              <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-tight md:text-[2.75rem] md:leading-[1.08] lg:max-w-none lg:text-5xl xl:text-6xl xl:leading-[1.06]">
                Dokumen rapi jadi PDF.
                <span className="mt-1 block bg-linear-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-primary">
                  Tanpa aplikasi tambahan.
                </span>
              </h1>
            </LandingMotionItem>
            <LandingMotionItem>
              <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl lg:max-w-lg">
                Scandify membantu Anda memfoto kertas, merapikan tampilan, dan mengekspor PDF — alur
                sederhana, tampilan modern, siap untuk pekerjaan harian.
              </p>
            </LandingMotionItem>
            <LandingMotionItem className="mt-10 flex w-full flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <LandingPressable className="inline-flex justify-center lg:justify-start">
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    className="h-12 min-w-[200px] rounded-full px-8 shadow-md shadow-primary/20"
                    asChild
                  >
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 min-w-[200px] rounded-full border-border/80 bg-card/60 px-8 backdrop-blur-sm"
                    asChild
                  >
                    <Link href="/register">Daftar</Link>
                  </Button>
                </div>
              </LandingPressable>
              <LandingPressable className="inline-flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 min-w-[200px] rounded-full px-8 shadow-sm"
                  asChild
                >
                  <Link href="/scan">Buka scanner</Link>
                </Button>
              </LandingPressable>
              <LandingPressable className="inline-flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 min-w-[200px] rounded-full border-border/80 bg-card/60 px-8 backdrop-blur-sm"
                  asChild
                >
                  <Link href="#cara-kerja">Lihat cara kerja</Link>
                </Button>
              </LandingPressable>
            </LandingMotionItem>
            <LandingMotionItem className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              {trust.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/25 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm sm:text-sm"
                >
                  <Icon className="size-3.5 shrink-0 text-primary sm:size-4" aria-hidden />
                  {label}
                </span>
              ))}
            </LandingMotionItem>
          </LandingHeroStagger>

          <motion.div
            className="relative mx-auto w-full max-w-lg [perspective:1100px] lg:mx-0 lg:max-w-none"
            initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.58, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative origin-center [transform-style:preserve-3d]"
              initial={{ rotateX: 8 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="absolute -inset-4 rounded-[1.35rem] bg-linear-to-br from-primary/20 via-transparent to-accent-muted/30 blur-2xl sm:-inset-6"
                aria-hidden
              />
              <HeroFloatingChip
                className="-left-1 top-[8%] sm:-left-2 sm:top-[10%]"
                delay={0.45}
              >
                <ScanLine className="size-3.5 text-primary" aria-hidden />
                Perspektif otomatis
              </HeroFloatingChip>
              <HeroFloatingChip
                className="-right-1 bottom-[22%] sm:-right-2 sm:bottom-[26%]"
                delay={0.58}
              >
                <Camera className="size-3.5 text-primary" aria-hidden />
                Kamera &amp; unggah
              </HeroFloatingChip>
              <motion.div
                id="demo-placeholder"
                className="relative rounded-2xl bg-linear-to-br from-primary/12 via-card/80 to-accent-muted/25 p-[1px] shadow-2xl shadow-primary/10 ring-1 ring-border/60 dark:shadow-primary/15"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                <div className="overflow-hidden rounded-2xl bg-card/95 backdrop-blur-md">
                  <div className="flex items-center gap-2 border-b border-border/60 bg-muted/35 px-3 py-2.5 sm:px-4">
                    <div className="flex gap-1.5" aria-hidden>
                      <span className="size-2.5 rounded-full bg-[#ec6a5e]/90 sm:size-3" />
                      <span className="size-2.5 rounded-full bg-[#f4bf4f]/90 sm:size-3" />
                      <span className="size-2.5 rounded-full bg-[#61c554]/90 sm:size-3" />
                    </div>
                    <div className="min-w-0 flex-1 truncate rounded-md bg-background/85 px-3 py-1.5 text-center font-mono text-[10px] text-muted-foreground ring-1 ring-border/50 sm:text-xs">
                      scandify.app/scan
                    </div>
                  </div>
                  <div className="relative border-b border-border/60 bg-linear-to-br from-primary/8 via-transparent to-accent-muted/20 px-4 pb-8 pt-6 sm:px-8 sm:pb-10 sm:pt-8">
                    <HeroScanSweep />
                    <div className="absolute right-3 top-4 sm:right-5 sm:top-5">
                      <Badge variant="outline" className="rounded-full backdrop-blur-sm">
                        Pratinjau hidup
                      </Badge>
                    </div>
                    <div className="mx-auto flex max-w-lg flex-col items-center pt-6 text-center sm:pt-2">
                      <CardTitle className="text-lg sm:text-xl">Sebelum &amp; sesudah</CardTitle>
                      <CardDescription className="mt-2 max-w-md text-sm sm:text-base">
                        Contoh foto dokumen dari ponsel — geser untuk melihat perbedaan.
                      </CardDescription>
                      <div className="mt-6 w-full sm:mt-8">
                        <DemoBeforeAfter />
                      </div>
                    </div>
                  </div>
                  <CardFooter className="flex flex-wrap items-center justify-center gap-3 border-0 bg-muted/25 py-3.5 text-xs text-muted-foreground sm:justify-between sm:px-6 sm:text-sm">
                    <span className="inline-flex items-center gap-2">
                      <Shield className="size-4 text-primary" aria-hidden />
                      Privasi-by-design (roadmap)
                    </span>
                    <span className="hidden sm:inline">PDF · multi-halaman · pratinjau</span>
                  </CardFooter>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </LandingHeroInteractiveSection>
  );
}
