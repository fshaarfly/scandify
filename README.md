# Scandify

Aplikasi web untuk memindai dokumen di peramban: ambil foto dari kamera atau unggah gambar, rapikan tampilan, lalu gabungkan halaman menjadi satu PDF. Landing, formulir early access, dan halaman legal (kontak, privasi, syarat) disertakan.

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

Buka [http://localhost:3000](http://localhost:3000). Halaman scanner: [http://localhost:3000/scan](http://localhost:3000/scan).

Perintah lain:

```bash
npm run build   # build produksi
npm run start   # jalankan server setelah build
npm run lint    # ESLint
```

## Struktur singkat

| Rute | Isi |
|------|-----|
| `/` | Landing, fitur, FAQ, formulir early access |
| `/scan` | Ruang kerja scan (kamera / unggah, urutan halaman, unduh PDF) |
| `/kontak`, `/privasi`, `/syarat` | Halaman informasi |

Komponen utama ada di `components/` (mis. `scan-workspace.tsx`, `early-access-form.tsx`). Server action early access: `app/actions/early-access.ts`.

## Early access (opsional)

Formulir di beranda dapat mengirim email ke salah satu saluran berikut — konfigurasi lewat variabel lingkungan:

| Variabel | Fungsi |
|----------|--------|
| `EARLY_ACCESS_WEBHOOK_URL` | Webhook (mis. Discord) untuk notifikasi |
| `RESEND_API_KEY` + `EARLY_ACCESS_NOTIFY_EMAIL` | Email lewat [Resend](https://resend.com) |

Jika tidak ada yang diatur di lingkungan produksi, pastikan salah satu saluran tersedia. Untuk pengembangan lokal (`npm run dev`), tanpa webhook/Resend, pendaftaran ditulis ke `data/early-access.jsonl` (folder `data/` dibuat otomatis; file ini diabaikan Git).

## Lisensi & kontribusi

Proyek ini bersifat privat (`private` di `package.json`). Sesuaikan bagian ini jika repositori dibuka untuk kontribusi publik.
