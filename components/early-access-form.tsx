"use client";

import Link from "next/link";
import { useActionState } from "react";

import { submitEarlyAccess, type EarlyAccessState } from "@/app/actions/early-access";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initial: EarlyAccessState = { ok: false, message: "" };

export function EarlyAccessForm() {
  const [state, formAction, pending] = useActionState(submitEarlyAccess, initial);

  return (
    <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-4 sm:max-w-lg">
      {state.ok ? (
        <p
          className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-foreground"
          role="status"
        >
          {state.message}
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-3">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="sr-only"
            aria-hidden
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <label className="sr-only" htmlFor="early-access-email">
              Email
            </label>
            <input
              id="early-access-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="nama@email.com"
              disabled={pending}
              className={cn(
                "h-12 min-h-12 w-full flex-1 rounded-full border border-border/80 bg-background/80 px-4 text-base shadow-sm outline-none",
                "placeholder:text-muted-foreground",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
                "disabled:opacity-60",
              )}
            />
            <Button
              type="submit"
              size="lg"
              variant="secondary"
              className="h-12 shrink-0 rounded-full px-8"
              disabled={pending}
            >
              {pending ? "Mengirim…" : "Daftar"}
            </Button>
          </div>
          {state.message ? (
            <p className="text-center text-sm text-destructive" role="alert">
              {state.message}
            </p>
          ) : null}
        </form>
      )}

      <div className="flex justify-center">
        <Button size="lg" className="h-12 rounded-full px-8" variant="outline" asChild>
          <Link href="#demo-placeholder">Lihat area demo</Link>
        </Button>
      </div>
    </div>
  );
}
