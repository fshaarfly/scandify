import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { StaticPageShell } from "@/components/static-page-shell";
import { Button } from "@/components/ui/button";

const SUPPORT_EMAIL = "support@scandify.app";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi tim Scandify untuk pertanyaan produk, privasi, atau kemitraan.",
};

export default function KontakPage() {
  return (
    <StaticPageShell>
      <article className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Kontak</h1>
          <p>
            Kami membaca pesan untuk pertanyaan umum, umpan balik produk, dan permintaan terkait privasi
            atau data.
          </p>
        </header>

        <section className="rounded-xl border border-border/80 bg-muted/20 p-6 ring-1 ring-foreground/5">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">Email</h2>
          <p className="mt-2">
            Kirim ke alamat di bawah. Sertakan konteks singkat agar kami bisa merespons lebih cepat.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 hover:underline"
            >
              <Mail className="size-4 shrink-0" aria-hidden />
              {SUPPORT_EMAIL}
            </a>
            <Button variant="secondary" size="sm" className="w-fit shrink-0" asChild>
              <a href={`mailto:${SUPPORT_EMAIL}`}>Buka klien email</a>
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">Waktu respons</h2>
          <p>
            Tim kecil — kami berusaha membalas dalam beberapa hari kerja. Untuk isu keamanan, sertakan
            &quot;Security&quot; di subjek email.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">Akun &amp; login</h2>
          <p>
            Untuk masuk ke akun (penyambungan Supabase menyusul), buka{" "}
            <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              halaman login
            </Link>
            .
          </p>
        </section>
      </article>
    </StaticPageShell>
  );
}
