import Link from "next/link";
import {
  Camera,
  Check,
  FileDown,
  ScanLine,
  Shield,
  Sparkles,
} from "lucide-react";

import { DemoBeforeAfter } from "@/components/demo-before-after";
import { EarlyAccessForm } from "@/components/early-access-form";
import { LandingFaq } from "@/components/landing-faq";
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
    body: "Login menyusul; siapkan dokumen di meja atau pegang stabil saat memotret.",
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
    a: "Ini halaman awal produk. Daftar early access lewat tombol di bawah; kami kabari saat beta siap.",
  },
];

function HeroBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -left-40 top-[-10%] h-[min(100vw,28rem)] w-[min(100vw,28rem)] rounded-full bg-primary/25 blur-[100px] dark:bg-primary/30" />
      <div className="absolute -right-32 top-[20%] h-[min(90vw,24rem)] w-[min(90vw,24rem)] rounded-full bg-accent-muted/90 blur-[90px] dark:bg-accent-muted/50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(24_24_27/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(24_24_27/0.06)_1px,transparent_1px)] bg-size-[52px_52px] mask-[radial-gradient(ellipse_70%_55%_at_50%_-5%,#000_50%,transparent)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)]" />
    </div>
  );
}

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
                <Link href="#early-access">Early access</Link>
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
        <section className="relative overflow-hidden border-b border-border/80 px-4 py-20 sm:px-6 sm:py-28">
          <HeroBackdrop />
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center">
              <Badge
                variant="secondary"
                className="mb-6 rounded-full border border-border/80 bg-card/80 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm"
              >
                <Sparkles className="size-3" aria-hidden />
                Scan dokumen di browser
              </Badge>
              <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-tight md:text-6xl md:leading-[1.06]">
                Dokumen rapi jadi PDF.
                <span className="mt-1 block bg-linear-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent dark:from-white dark:via-zinc-200 dark:to-primary">
                  Tanpa aplikasi tambahan.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
                Scandify membantu Anda memfoto kertas, merapikan tampilan, dan mengekspor PDF — alur
                sederhana, tampilan modern, siap untuk pekerjaan harian.
              </p>
              <div className="mt-10 flex flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Button size="lg" className="h-12 min-w-[200px] rounded-full px-8 shadow-md shadow-primary/20" asChild>
                  <Link href="#early-access">Gabung early access</Link>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 min-w-[200px] rounded-full px-8 shadow-sm"
                  asChild
                >
                  <Link href="/scan">Buka scanner</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 min-w-[200px] rounded-full border-border/80 bg-card/60 px-8 backdrop-blur-sm"
                  asChild
                >
                  <Link href="#cara-kerja">Lihat cara kerja</Link>
                </Button>
              </div>
            </div>

            <Card
              id="demo-placeholder"
              className="mx-auto mt-16 max-w-3xl overflow-hidden border-border/80 bg-card/70 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/40"
            >
              <div className="relative border-b border-border/60 bg-linear-to-br from-primary/10 via-transparent to-accent-muted/30 px-4 py-8 sm:px-10 sm:py-10">
                <div className="absolute right-4 top-6 sm:right-6">
                  <Badge variant="outline" className="rounded-full">
                    Pratinjau
                  </Badge>
                </div>
                <div className="mx-auto flex max-w-lg flex-col items-center pt-8 text-center sm:pt-2">
                  <CardTitle className="text-lg sm:text-xl">Sebelum &amp; sesudah</CardTitle>
                  <CardDescription className="mt-2 max-w-md text-base">
                    Contoh foto dokumen dari ponsel — geser untuk melihat perbedaan.
                  </CardDescription>
                  <div className="mt-8 w-full">
                    <DemoBeforeAfter />
                  </div>
                </div>
              </div>
              <CardFooter className="flex flex-wrap items-center justify-center gap-3 border-border/60 bg-muted/30 py-4 text-xs text-muted-foreground sm:justify-between sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <Shield className="size-4 text-primary" aria-hidden />
                  Privasi-by-design (roadmap)
                </span>
                <span className="hidden sm:inline">PDF · multi-halaman · pratinjau</span>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section id="fitur" className="scroll-mt-20 border-b border-border/80 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 rounded-full">
                Fitur inti
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Yang Anda butuhkan untuk dokumen digital
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tiga pilar produk — dari input gambar hingga file PDF yang rapi.
              </p>
            </div>
            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fitur.map((item) => (
                <li key={item.title}>
                  <Card className="group h-full border-border/80 bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5">
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
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="cara-kerja" className="scroll-mt-20 border-b border-border/80 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Cara kerja
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tiga langkah singkat — cepat dipahami, mudah diingat.
              </p>
            </div>
            <ol className="mt-14 grid gap-6 sm:grid-cols-3">
              {langkah.map((item) => (
                <li key={item.no}>
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
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="harga" className="scroll-mt-20 border-b border-border/80 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Harga placeholder
              </h2>
              <p className="mt-4 text-muted-foreground">
                Angka di bawah contoh — akan disesuaikan setelah model bisnis final.
              </p>
            </div>
            <ul className="mt-14 grid gap-6 lg:grid-cols-3">
              {paket.map((p) => (
                <li key={p.name}>
                  <Card
                    className={cn(
                      "relative flex h-full flex-col overflow-hidden border-border/80 bg-card/90 transition-all duration-300 hover:shadow-lg",
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
                        <Link href="#early-access">
                          {p.name === "Studio" ? "Hubungi kami" : "Pilih paket"}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 border-b border-border/80 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Pertanyaan umum
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Jawaban singkat — detail legal menyusul bersama peluncuran beta.
            </p>
            <div className="mt-10">
              <LandingFaq items={faq} />
            </div>
          </div>
        </section>

        <section id="early-access" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <Card className="overflow-hidden border-border/80 bg-card/90 text-center shadow-xl shadow-black/5 dark:shadow-black/30">
              <div className="bg-linear-to-br from-primary/15 via-card to-accent-muted/20 px-8 py-14 sm:px-12">
                <Badge variant="secondary" className="mb-4 rounded-full">
                  Early access
                </Badge>
                <CardTitle className="text-2xl sm:text-3xl">
                  Siap merapikan dokumen berikutnya?
                </CardTitle>
                <CardDescription className="mx-auto mt-3 max-w-lg text-base">
                  Daftarkan email Anda — kami kabari saat beta dibuka. Tanpa spam; autentikasi akun
                  menyusul bersama integrasi cloud opsional.
                </CardDescription>
                <div className="mx-auto flex w-full justify-center">
                  <EarlyAccessForm />
                </div>
              </div>
            </Card>
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
