import type { Metadata } from "next";
import Link from "next/link";

import { StaticPageShell } from "@/components/static-page-shell";

export const metadata: Metadata = {
  title: "Kebijakan privasi",
  description:
    "Bagaimana Scandify memperlakukan data Anda: pemrosesan di peramban, log minimal, dan hak Anda.",
};

export default function PrivasiPage() {
  return (
    <StaticPageShell>
      <article className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Kebijakan privasi
          </h1>
          <p className="text-muted-foreground">
            Ringkasan prinsip privasi Scandify. Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            .
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">1. Ruang lingkup</h2>
          <p>
            Kebijakan ini menjelaskan bagaimana kami memperlakukan informasi saat Anda mengunjungi situs
            atau menggunakan fitur Scandify. Produk masih berkembang; kami akan memperjelas detail
            sebelum peluncuran resmi bila ada pemrosesan server tambahan.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">2. Arah produk: privasi-by-design</h2>
          <p>
            Rencana produk kami mengutamakan pemrosesan utama di peramban Anda agar dokumen sensitif tidak
            perlu meninggalkan perangkat lebih dari yang diperlukan. Fitur tertentu (misalnya autentikasi
            atau sinkronisasi cloud) dapat memerlukan transfer data — akan dijelaskan di bagian terkait
            saat fitur itu aktif.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">3. Data yang kami kumpulkan</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-foreground">Akun &amp; autentikasi:</span> bila Anda
              mendaftar atau masuk, identitas dan kredensial dikelola melalui penyedia autentikasi (rencana:
              Supabase) sesuai ketentuan mereka dan pengaturan produk kami.
            </li>
            <li>
              <span className="font-medium text-foreground">Log &amp; analitik:</span> kami dapat
              mencatat informasi teknis standar (misalnya jenis peramban, kesalahan server) untuk keamanan
              dan perbaikan layanan. Kami menghindari pelacakan perilaku yang tidak perlu.
            </li>
            <li>
              <span className="font-medium text-foreground">Dokumen Anda:</span> saat pemrosesan sepenuhnya
              di peramban, file tidak dikirim ke server kami kecuali Anda secara eksplisit menggunakan
              fitur yang memerlukan unggahan (jika tersedia).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">4. Dasar dan tujuan pemrosesan</h2>
          <p>
            Kami memproses data untuk menyediakan layanan, merespons permintaan Anda, meningkatkan keamanan,
            dan memenuhi kewajiban hukum. Untuk komunikasi pemasaran (jika ada), kami akan meminta persetujuan
            sesuai ketentuan yang berlaku.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">5. Penyimpanan &amp; retensi</h2>
          <p>
            Data disimpan selama diperlukan untuk tujuan di atas atau sesuai jangka waktu yang kami
            tentukan di dokumentasi produk. Anda dapat meminta penghapusan atau pembatasan data akun sesuai
            prosedur yang kami sediakan.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">6. Pembagian ke pihak ketiga</h2>
          <p>
            Kami tidak menjual data pribadi Anda. Penyedia infrastruktur (hosting, email transaksional)
            dapat memproses data atas nama kami berdasarkan kontrak yang membatasi penggunaan mereka.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">7. Hak Anda</h2>
          <p>
            Bergantung pada hukum yang berlaku di wilayah Anda, Anda dapat memiliki hak untuk mengakses,
            memperbaiki, menghapus, membatasi, atau menolak pemrosesan tertentu, serta mengajukan keluhan
            ke otoritas pengawas. Hubungi kami lewat halaman kontak untuk permintaan tersebut.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">8. Keamanan</h2>
          <p>
            Kami menerapkan langkah teknis dan organisasi yang wajar untuk melindungi data. Tidak ada metode
            transmisi atau penyimpanan yang 100% aman; mohon gunakan perangkat dan jaringan yang Anda
            percayai saat memproses dokumen sensitif.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">9. Perubahan kebijakan</h2>
          <p>
            Kami dapat memperbarui halaman ini. Tanggal di bagian atas mencerminkan revisi terakhir.
            Penggunaan berkelanjutan setelah pembaruan berarti Anda mengakui kebijakan yang baru.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">10. Kontak</h2>
          <p>
            Untuk pertanyaan privasi, kunjungi{" "}
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
