# Scandify

Aplikasi web untuk memindai dokumen di peramban: ambil foto dari kamera atau unggah gambar, rapikan tampilan, lalu gabungkan halaman menjadi satu PDF. Landing, halaman login (placeholder siap dihubungkan ke Supabase), dan halaman legal (kontak, privasi, syarat) disertakan.

## Teknologi

- [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript
- [Tailwind CSS](https://tailwindcss.com) 4
- [scanic](https://www.npmjs.com/package/scanic) — pemrosesan gambar / perspektif di klien
- [pdf-lib](https://pdf-lib.js.org/) — penyusunan PDF
- Komponen UI: Radix, shadcn, lucide-react, next-themes

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Halaman scanner: [http://localhost:3000/scan](http://localhost:3000/scan). Halaman login: [http://localhost:3000/login](http://localhost:3000/login).

Perintah lain:

```bash
npm run build   # build produksi
npm run start   # jalankan server setelah build
npm run lint    # ESLint
```

## Struktur singkat

| Rute | Isi |
|------|-----|
| `/` | Landing, fitur, FAQ, CTA akun / login |
| `/login` | Formulir masuk (UI; autentikasi Supabase menyusul) |
| `/scan` | Ruang kerja scan (kamera / unggah, urutan halaman, unduh PDF) |
| `/kontak`, `/privasi`, `/syarat` | Halaman informasi |

Komponen utama ada di `components/` (mis. `scan-workspace.tsx`, `login-form.tsx`).

## Autentikasi (rencana: Supabase)

Saat ini halaman `/login` hanya menampilkan antarmuka dan pesan placeholder. Langkah integrasi yang umum:

1. Buat proyek di [Supabase](https://supabase.com), salin URL proyek dan kunci anon.
2. Tambahkan variabel lingkungan (nama pastikan mengikuti panduan resmi Supabase + Next.js Anda), misalnya `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Pasang `@supabase/supabase-js` (dan helper resmi App Router / middleware jika dipakai).
4. Ganti logika submit di `components/login-form.tsx` dengan pemanggilan auth Supabase (email+kata sandi, magic link, atau OAuth).

Detail kebijakan data setelah auth aktif sebaiknya diperbarui di halaman **Privasi**.

## Lisensi & kontribusi

Proyek ini bersifat privat (`private` di `package.json`). Sesuaikan bagian ini jika repositori dibuka untuk kontribusi publik.
