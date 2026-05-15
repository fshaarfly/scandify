import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { StaticPageShell } from "@/components/static-page-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Scandify dengan email dan kata sandi (Supabase Auth).",
};

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/scan");
  }

  const q = searchParams ? await searchParams : {};
  const linkError =
    q.error === "callback"
      ? "Tautan masuk tidak valid atau sudah kedaluwarsa. Minta tautan baru atau coba masuk dengan email dan kata sandi."
      : null;

  return (
    <StaticPageShell>
      <div className="mx-auto max-w-md">
        <LoginForm linkError={linkError} />
      </div>
    </StaticPageShell>
  );
}
