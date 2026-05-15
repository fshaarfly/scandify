import Link from "next/link";
import {
  Camera,
  Check,
  FileDown,
  ScanLine,
  Sparkles,
} from "lucide-react";

import { LandingFaq } from "@/components/landing-faq";
import { LandingHero } from "@/components/landing-hero";
import {
  LandingMotionCard,
  LandingScrollReveal,
  LandingStaggerChild,
  LandingStaggerGrid,
} from "@/components/landing-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/scan", label: "Scan" },
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
];

const fitur = [
  {
    title: "Kamera atau unggah",
    body: "Ambil foto langsung dari perangkat atau pilih gambar dari galeri. Satu alur untuk semua dokumen.",
    Icon: Camera,
  },
  {
    title: "Rapikan & luruskan",
    body: "Koreksi perspektif dan tampilan bersih seperti hasil scanner meja — tanpa instal aplikasi.",
    Icon: ScanLine,
  },
  {
    title: "Unduh PDF",
    body: "Gabungkan halaman jadi satu PDF siap dibagikan atau diarsipkan. Fokus ke kejelasan halaman.",
    Icon: FileDown,
  },
];

const langkah = [
  {
    no: "1",
    title: "Buka Scandify",
    body: "Buka /login bila sudah punya akun (Supabase menyusul); siapkan dokumen atau pegang stabil saat memotret.",
    Icon: Sparkles,
  },
  {
    no: "2",
    title: "Ambil gambar",
    body: "Pastikan pencahayaan cukup. Kami bantu merapikan sudut dan mengurangi bayangan.",
    Icon: Camera,
  },
  {
    no: "3",
    title: "Ekspor PDF",
    body: "Pratinjau, atur urutan halaman jika perlu, lalu unduh file siap pakai.",
    Icon: FileDown,
  },
];

const paket = [
  {
    name: "Starter",
    desc: "Untuk pemakaian pribadi ringan",
    harga: "Rp49rb",
    periode: "/bulan",
    highlight: false,
    items: ["50 halaman / bulan", "Ekspor PDF", "Dukungan email"],
  },
  {
    name: "Pro",
    desc: "Untuk pekerjaan & tim kecil",
    harga: "Rp149rb",
    periode: "/bulan",
    highlight: true,
    items: [
      "500 halaman / bulan",
      "Antrian prioritas",
      "Riwayat cloud (saat Supabase aktif)",
      "Dukungan prioritas",
    ],
  },
  {
    name: "Studio",
    desc: "Agensi & volume tinggi",
    harga: "Kontak",
    periode: "",
    highlight: false,
    items: ["Volume fleksibel", "SLA", "Integrasi khusus"],
  },
];

const faq = [
  {
    q: "Apakah Scandify mengunggah dokumen ke server?",
    a: "Rencana produk: pemrosesan utama di browser agar privasi lebih baik. Detail kebijakan akan kami tulis di halaman privasi sebelum peluncuran.",
  },
  {
    q: "Apakah sama dengan Adobe Scan?",
    a: "Tujuannya mirip — dokumen rapi jadi PDF — dengan fokus web tanpa instal aplikasi native. Fitur akan bertahap (OCR bisa menyusul).",
  },
  {
    q: "Kapan bisa dipakai?",
    a: "Scanner di /scan sudah bisa dicoba. Akun login akan menyusul lewat Supabase untuk sinkronisasi dan fitur berlangganan.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/75 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link
              href="/"
              className="shrink-0 text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
            >
              Scandify
            </Link>
            <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Button size="lg" className="rounded-full px-5 shadow-sm" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
            </div>
          </div>
          <nav
            aria-label="Navigasi utama"
            className="flex gap-4 overflow-x-auto border-t border-border/60 py-3 text-sm font-medium text-muted-foreground md:hidden"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <LandingHero />

        <section id="fitur" className="scroll-mt-20 border-b border-border/80 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <LandingScrollReveal className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 rounded-full">
                Fitur inti
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Yang Anda butuhkan untuk dokumen digital
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tiga pilar produk — dari input gambar hingga file PDF yang rapi.
              </p>
            </LandingScrollReveal>
            <LandingStaggerGrid className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fitur.map((item) => (
                <LandingStaggerChild key={item.title} className="min-w-0">
                  <LandingMotionCard className="h-full">
                    <Card className="group h-full border-border/80 bg-card/80 shadow-sm transition-colors duration-300 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5">
                      <CardHeader className="gap-4">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/15">
                          <item.Icon className="size-5" aria-hidden />
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {item.body}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </LandingMotionCard>
                </LandingStaggerChild>
              ))}
            </LandingStaggerGrid>
          </div>
        </section>

        <section id="cara-kerja" className="scroll-mt-20 border-b border-border/80 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <LandingScrollReveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Cara kerja
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tiga langkah singkat — cepat dipahami, mudah diingat.
              </p>
            </LandingScrollReveal>
            <LandingStaggerGrid className="mt-14 grid gap-6 sm:grid-cols-3">
              {langkah.map((item) => (
                <LandingStaggerChild key={item.no} className="min-w-0">
                  <LandingMotionCard className="h-full">
                    <Card className="h-full border-border/80 bg-muted/20 text-center shadow-none ring-1 ring-border/60 transition-colors hover:bg-muted/35">
                      <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8">
                        <div className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/25">
                          {item.no}
                        </div>
                        <div className="flex size-10 items-center justify-center rounded-lg bg-card text-primary ring-1 ring-border/80">
                          <item.Icon className="size-5" aria-hidden />
                        </div>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                      </CardContent>
                    </Card>
                  </LandingMotionCard>
                </LandingStaggerChild>
              ))}
            </LandingStaggerGrid>
          </div>
        </section>

        <section id="harga" className="scroll-mt-20 border-b border-border/80 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <LandingScrollReveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Harga placeholder
              </h2>
              <p className="mt-4 text-muted-foreground">
                Angka di bawah contoh — akan disesuaikan setelah model bisnis final.
              </p>
            </LandingScrollReveal>
            <LandingStaggerGrid className="mt-14 grid gap-6 lg:grid-cols-3">
              {paket.map((p) => (
                <LandingStaggerChild key={p.name} className="min-w-0">
                  <LandingMotionCard className="h-full">
                    <Card
                      className={cn(
                        "relative flex h-full flex-col overflow-hidden border-border/80 bg-card/90 transition-shadow duration-300 hover:shadow-lg",
                        p.highlight &&
                          "border-primary/40 shadow-lg shadow-primary/10 ring-2 ring-primary/25 dark:shadow-primary/20",
                      )}
                    >
                    {p.highlight ? (
                      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-primary to-accent-muted" />
                    ) : null}
                    <CardHeader className="gap-1 pb-2">
                      <div className="flex min-h-8 items-center">
                        {p.highlight ? (
                          <Badge className="rounded-full">Paling populer</Badge>
                        ) : null}
                      </div>
                      <CardTitle className="text-xl">{p.name}</CardTitle>
                      <CardDescription>{p.desc}</CardDescription>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-bold tracking-tight text-foreground">
                          {p.harga}
                        </span>
                        {p.periode ? (
                          <span className="text-sm text-muted-foreground">{p.periode}</span>
                        ) : null}
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                      <Separator className="mb-2 bg-border/80" />
                      <ul className="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
                        {p.items.map((line) => (
                          <li key={line} className="flex gap-2 text-left">
                            <Check
                              className="mt-0.5 size-4 shrink-0 text-primary"
                              aria-hidden
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="border-t border-border/60 bg-muted/20">
                      <Button
                        className="w-full rounded-full"
                        variant={p.highlight ? "default" : "outline"}
                        asChild
                      >
                        <Link href={p.name === "Studio" ? "/kontak" : "/login"}>
                          {p.name === "Studio" ? "Hubungi kami" : "Pilih paket"}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  </LandingMotionCard>
                </LandingStaggerChild>
              ))}
            </LandingStaggerGrid>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 border-b border-border/80 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <LandingScrollReveal>
              <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Pertanyaan umum
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
                Jawaban singkat — detail legal menyusul bersama peluncuran beta.
              </p>
            </LandingScrollReveal>
            <div className="mt-10">
              <LandingFaq items={faq} />
            </div>
          </div>
        </section>

        <section id="masuk" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <LandingScrollReveal>
              <LandingMotionCard>
                <Card className="overflow-hidden border-border/80 bg-card/90 text-center shadow-xl shadow-black/5 dark:shadow-black/30">
                  <div className="bg-linear-to-br from-primary/15 via-card to-accent-muted/20 px-8 py-14 sm:px-12">
                    <Badge variant="secondary" className="mb-4 rounded-full">
                      Akun
                    </Badge>
                    <CardTitle className="text-2xl sm:text-3xl">
                      Masuk untuk melanjutkan nanti
                    </CardTitle>
                    <CardDescription className="mx-auto mt-3 max-w-lg text-base">
                      Halaman login siap dihubungkan ke Supabase (sesi, profil, dan opsi cloud). Scanner
                      tetap dapat dipakai tanpa akun lewat tautan di bawah.
                    </CardDescription>
                    <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
                      <Button size="lg" className="h-12 rounded-full px-8 shadow-md shadow-primary/20" asChild>
                        <Link href="/login">Buka login</Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="h-12 rounded-full px-8 shadow-sm"
                        asChild
                      >
                        <Link href="/scan">Buka scanner</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </LandingMotionCard>
            </LandingScrollReveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/80 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-foreground">Scandify</p>
            <p className="mt-1 text-sm text-muted-foreground">
              © {new Date().getFullYear()} Scandify. Hak cipta dilindungi.
            </p>
          </div>
          <Separator className="sm:hidden" />
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <Link href="/syarat" className="transition-colors hover:text-foreground">
              Syarat
            </Link>
            <Link href="/privasi" className="transition-colors hover:text-foreground">
              Privasi
            </Link>
            <Link href="/kontak" className="transition-colors hover:text-foreground">
              Kontak
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
