import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { StaticPageShell } from "@/components/static-page-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Scandify dengan email dan kata sandi (Supabase Auth).",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/scan");
  }

  return (
    <StaticPageShell>
      <div className="mx-auto max-w-md">
        <LoginForm />
      </div>
    </StaticPageShell>
  );
}
