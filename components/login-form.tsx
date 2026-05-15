"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function authErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Email atau kata sandi salah.";
  }
  if (m.includes("email not confirmed")) {
    return "Email belum dikonfirmasi. Periksa kotak masuk Anda.";
  }
  if (m.includes("too many requests")) {
    return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  }
  return message;
}

const fieldClass = cn(
  "h-12 w-full rounded-xl border border-border/80 bg-background/80 px-4 text-base shadow-sm outline-none",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
  "disabled:opacity-60",
);

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(authErrorMessage(signError.message));
        return;
      }
      router.push("/scan");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border/80 bg-card/90 shadow-lg shadow-black/5 dark:shadow-black/25">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Masuk</CardTitle>
        <CardDescription>
          Gunakan email dan kata sandi akun Scandify Anda (Supabase Auth).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              placeholder="nama@email.com"
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-password" className="text-sm font-medium text-foreground">
              Kata sandi
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
              placeholder="••••••••"
              className={fieldClass}
            />
          </div>
          {error ? (
            <p
              className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            className="h-12 w-full rounded-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Memproses…" : "Masuk"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <span>Belum punya akun? Buat pengguna di dashboard Supabase (Authentication) atau lewat alur daftar nanti.</span>
        <Button variant="link" className="h-auto p-0 text-foreground" asChild>
          <Link href="/">Kembali ke beranda</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
