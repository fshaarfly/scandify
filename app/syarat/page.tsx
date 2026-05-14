import type { Metadata } from "next";
import Link from "next/link";

import { StaticPageShell } from "@/components/static-page-shell";

export const metadata: Metadata = {
  title: "Syarat layanan",
  description:
    "Ketentuan penggunaan Scandify: hak dan kewajiban pengguna, batasan layanan, dan pembaruan kebijakan.",
};

export default function SyaratPage() {
  return (
    <StaticPageShell>
      <article className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Syarat layanan
          </h1>
          <p className="text-muted-foreground">
            Berlaku untuk penggunaan situs dan layanan Scandify. Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            .
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">1. Penerimaan ketentuan</h2>
          <p>
            Dengan mengakses atau menggunakan Scandify, Anda setuju terikat oleh syarat ini. Jika tidak
            setuju, mohon tidak menggunakan layanan kami.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">2. Deskripsi layanan</h2>
          <p>
            Scandify menyediakan alat bantu di peramban untuk memproses gambar dokumen dan menghasilkan
            PDF. Fitur, batasan, dan ketersediaan dapat berubah seiring pengembangan produk (termasuk
            fase beta atau pratinjau).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">3. Akun dan keamanan</h2>
          <p>
            Bila nanti layanan memerlukan akun, Anda bertanggung jawab menjaga kerahasiaan kredensial dan
            aktivitas di bawah akun Anda. Beri tahu kami jika menduga akses tidak sah.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">4. Penggunaan yang diizinkan</h2>
          <p>Anda setuju untuk tidak:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>melanggar hukum yang berlaku atau hak pihak ketiga;</li>
            <li>mengganggu, merusak, atau membebani infrastruktur layanan secara tidak wajar;</li>
            <li>mencoba mengakses sistem atau data tanpa izin;</li>
            <li>
              memproses konten yang melanggar hukum, mengandung malware, atau yang secara wajar dapat
              merugikan orang lain.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">5. Konten Anda</h2>
          <p>
            Anda memegang hak atas dokumen yang Anda unggah atau proses. Anda memberi kami izin teknis
            yang diperlukan hanya untuk menyediakan layanan (misalnya pemrosesan sementara di server jika
            fitur tersebut aktif — lihat juga halaman privasi).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">6. Penafian & ketersediaan</h2>
          <p>
            Layanan disediakan &quot;sebagaimana adanya&quot; selama pengembangan. Kami berupaya menjaga
            ketersediaan namun tidak menjamin bebas gangguan atau bebas kesalahan. Sejauh diizinkan hukum,
            kami mengecualikan jaminan tersirat tertentu.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">7. Batas tanggung jawab</h2>
          <p>
            Sejauh diizinkan hukum, tanggung jawab total Scandify terhadap klaim terkait layanan dibatasi
            pada jumlah yang wajar yang Anda bayarkan kepada kami dalam periode dua belas bulan terakhir
            untuk layanan tersebut, atau jika tidak ada pembayaran, pada nilai nominal yang ditetapkan
            undang-undang setempat.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">8. Perubahan syarat</h2>
          <p>
            Kami dapat memperbarui halaman ini. Perubahan material akan kami komunikasikan dengan cara yang
            wajar (misalnya tanggal &quot;terakhir diperbarui&quot; atau pemberitahuan di produk). Penggunaan
            berkelanjutan setelah pembaruan berarti Anda menerima syarat yang baru.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">9. Hubungi kami</h2>
          <p>
            Pertanyaan tentang syarat ini dapat diajukan lewat halaman{" "}
            <Link href="/kontak" className="font-medium text-foreground underline-offset-4 hover:underline">
              Kontak
            </Link>
            .
          </p>
        </section>
      </article>
    </StaticPageShell>
  );
}
