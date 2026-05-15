import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/register-form";
import { StaticPageShell } from "@/components/static-page-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Scandify dengan email (Supabase Auth).",
};

export default async function RegisterPage() {
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
        <RegisterForm />
      </div>
    </StaticPageShell>
  );
}
