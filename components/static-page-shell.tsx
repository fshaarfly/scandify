import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function StaticPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/75 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
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
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
