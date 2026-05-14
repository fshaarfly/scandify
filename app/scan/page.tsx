import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

import { ScanWorkspace } from "@/components/scan-workspace";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Scanner",
  description:
    "Tambah halaman dari kamera atau galeri, atur urutan, dan unduh PDF — pemrosesan di peramban Anda.",
};

export default function ScanPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/75 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
              <Link href="/" aria-label="Kembali ke beranda">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <Link
              href="/"
              className="truncate text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              Scandify
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">
        <ScanWorkspace />
      </main>
    </div>
  );
}
