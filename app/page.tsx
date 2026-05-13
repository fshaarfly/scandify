import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#harga", label: "Harga" },
  { href: "#faq", label: "FAQ" },
];

const fitur = [
  {
    title: "Kamera atau unggah",
    body: "Ambil foto langsung dari perangkat atau pilih gambar dari galeri. Satu alur untuk semua dokumen.",
  },
  {
    title: "Rapikan & luruskan",
    body: "Koreksi perspektif dan tampilan bersih seperti hasil scanner meja — tanpa instal aplikasi.",
  },
  {
    title: "Unduh PDF",
    body: "Gabungkan halaman jadi satu PDF siap dibagikan atau diarsipkan. Fokus ke kejelasan halaman.",
  },
];

const langkah = [
  { no: "1", title: "Buka Scandify", body: "Login nanti; untuk sekarang cukup siapkan dokumen di meja atau tangan." },
  { no: "2", title: "Ambil gambar", body: "Pastikan pencukuran cukup; kami bantu merapikan sudut dan bayangan." },
  { no: "3", title: "Ekspor PDF", body: "Pratinjau, atur urutan halaman jika perlu, lalu unduh." },
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

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight text-foreground">
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
              <Link
                href="#early-access"
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Early access
              </Link>
            </div>
          </div>
          <nav
            aria-label="Navigasi utama"
            className="flex gap-4 overflow-x-auto border-t border-border py-3 text-sm font-medium text-muted-foreground md:hidden"
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
        <section className="border-b border-border px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-center text-sm font-medium text-accent">
              Scan dokumen di web
            </p>
            <h1 className="mx-auto max-w-4xl text-center text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl sm:leading-tight md:text-6xl md:leading-[1.08]">
              Dokumen rapi jadi PDF.
              <span className="block text-muted-foreground">Tanpa aplikasi tambahan.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl">
              Scandify membantu Anda memfoto kertas, merapikan tampilan, dan mengekspor PDF — alur sederhana,
              tampilan modern, siap untuk pekerjaan harian.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="#early-access"
                className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Gabung early access
              </Link>
              <Link
                href="#cara-kerja"
                className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full border border-border bg-card px-8 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
              >
                Lihat cara kerja
              </Link>
            </div>
            <div
              id="demo-placeholder"
              className="mx-auto mt-16 max-w-3xl rounded-2xl border border-dashed border-border bg-muted/50 p-12 text-center"
            >
              <p className="text-sm font-medium text-muted-foreground">
                Area demo / pratinjau produk
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Nanti bisa berisi rekaman layar atau widget scan interaktif.
              </p>
            </div>
          </div>
        </section>

        <section id="fitur" className="scroll-mt-20 border-b border-border px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Yang Anda butuhkan untuk dokumen digital
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Tiga pilar produk — dari input gambar hingga file PDF yang rapi.
            </p>
            <ul className="mt-14 grid gap-6 sm:grid-cols-3">
              {fitur.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-8 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-card-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="cara-kerja" className="scroll-mt-20 border-b border-border px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Cara kerja
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Alur singkat — mirip ritme landing modern yang Anda sukai.
            </p>
            <ol className="mt-14 grid gap-8 sm:grid-cols-3">
              {langkah.map((item) => (
                <li key={item.no} className="relative flex flex-col items-center text-center">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-muted text-base font-bold text-accent">
                    {item.no}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="harga" className="scroll-mt-20 border-b border-border px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Harga placeholder
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Angka di bawah contoh saja — akan disesuaikan setelah model bisnis final.
            </p>
            <ul className="mt-14 grid gap-6 lg:grid-cols-3">
              {paket.map((p) => (
                <li
                  key={p.name}
                  className={`flex flex-col rounded-2xl border p-8 shadow-sm ${
                    p.highlight
                      ? "border-accent bg-accent-muted/30 ring-2 ring-accent"
                      : "border-border bg-card"
                  }`}
                >
                  {p.highlight ? (
                    <span className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      Paling populer
                    </span>
                  ) : (
                    <span className="mb-3 h-7" aria-hidden />
                  )}
                  <h3 className="text-xl font-semibold text-foreground">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight text-foreground">{p.harga}</span>
                    {p.periode ? (
                      <span className="text-sm text-muted-foreground">{p.periode}</span>
                    ) : null}
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
                    {p.items.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-0.5 text-accent" aria-hidden>
                          ✓
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#early-access"
                    className={`mt-8 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      p.highlight
                        ? "bg-accent text-accent-foreground hover:opacity-90"
                        : "border border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {p.name === "Studio" ? "Hubungi kami" : "Pilih paket"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 border-b border-border px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Pertanyaan umum
            </h2>
            <div className="mt-12 space-y-3">
              {faq.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-border bg-card px-5 py-1 shadow-sm open:pb-4"
                >
                  <summary className="cursor-pointer list-none py-4 text-sm font-semibold text-card-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-3">
                      {item.q}
                      <span className="text-muted-foreground transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id="early-access"
          className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24"
        >
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card px-8 py-14 text-center shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Siap merapikan dokumen berikutnya?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Early access: tautan formulir atau auth akan menyusul. Untuk sekarang, lanjutkan pengembangan produk di repo Anda.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <span className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-muted px-8 text-sm font-medium text-muted-foreground">
                Form pendaftaran — segera
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Scandify</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="#" className="hover:text-foreground">
              Syarat
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privasi
            </Link>
            <Link href="#" className="hover:text-foreground">
              Kontak
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
