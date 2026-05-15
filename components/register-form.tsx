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
import { authInputClass } from "@/lib/auth-fields";
import { mapAuthError } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/client";

const MIN_PASSWORD_LEN = 6;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const password2 = String(fd.get("password2") ?? "");

    if (!email) {
      setError("Isi email Anda.");
      return;
    }
    if (password.length < MIN_PASSWORD_LEN) {
      setError(`Kata sandi minimal ${MIN_PASSWORD_LEN} karakter.`);
      return;
    }
    if (password !== password2) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }

    const origin = window.location.origin;
    const emailRedirectTo = `${origin}/auth/callback?next=/scan`;

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      });
      if (signError) {
        setError(mapAuthError(signError.message));
        return;
      }
      if (data.session) {
        router.push("/scan");
        router.refresh();
        return;
      }
      setInfo(
        "Silahkan cek kotak masuk anda untuk tautan verifikasi.",
      );
      form.reset();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border/80 bg-card/90 shadow-lg shadow-black/5 dark:shadow-black/25">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Daftar</CardTitle>
        <CardDescription>
          Buat akun dengan email dan kata sandi. Anda akan
          mendapat tautan verifikasi yang dikirim ke email anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label htmlFor="register-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              disabled={loading}
              placeholder="nama@email.com"
              className={authInputClass}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-password" className="text-sm font-medium text-foreground">
              Kata sandi
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD_LEN}
              disabled={loading}
              placeholder="Minimal 6 karakter"
              className={authInputClass}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="register-password2" className="text-sm font-medium text-foreground">
              Ulangi kata sandi
            </label>
            <input
              id="register-password2"
              name="password2"
              type="password"
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD_LEN}
              disabled={loading}
              placeholder="Ulangi kata sandi"
              className={authInputClass}
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
          {info ? (
            <p
              className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-foreground"
              role="status"
            >
              {info}
            </p>
          ) : null}
          <Button
            type="submit"
            className="h-12 w-full rounded-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Memproses…" : "Buat akun"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground">
        <p className="text-center sm:text-left">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Masuk
          </Link>
        </p>
        <div className="flex justify-center sm:justify-end">
          <Button variant="link" className="h-auto p-0 text-foreground" asChild>
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
