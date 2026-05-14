"use server";

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type EarlyAccessState = {
  ok: boolean;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isDiscordWebhook(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.pathname.includes("/api/webhooks/") &&
      (u.hostname === "discord.com" || u.hostname === "discordapp.com")
    );
  } catch {
    return false;
  }
}

export async function submitEarlyAccess(
  _prev: EarlyAccessState,
  formData: FormData,
): Promise<EarlyAccessState> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) {
    return { ok: true, message: "Terima kasih! Kami akan menghubungi Anda." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { ok: false, message: "Masukkan email Anda." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Format email tidak valid." };
  }

  const webhook = process.env.EARLY_ACCESS_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const resendTo = process.env.EARLY_ACCESS_NOTIFY_EMAIL;

  let stored = false;

  if (webhook) {
    try {
      const at = new Date().toISOString();
      const body = isDiscordWebhook(webhook)
        ? JSON.stringify({
            embeds: [
              {
                title: "Early access — Scandify",
                color: 0x22c55e,
                fields: [
                  { name: "Email", value: email, inline: true },
                  { name: "Waktu (UTC)", value: at, inline: true },
                ],
                footer: { text: "scandify-early-access" },
              },
            ],
          })
        : JSON.stringify({
            email,
            source: "scandify-early-access",
            at,
          });
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!res.ok) {
        console.error("[early-access] webhook", res.status, await res.text());
        return { ok: false, message: "Gagal mendaftar. Coba lagi sebentar lagi." };
      }
      stored = true;
    } catch (e) {
      console.error("[early-access] webhook", e);
      return { ok: false, message: "Gagal mendaftar. Coba lagi sebentar lagi." };
    }
  } else if (resendKey && resendTo) {
    try {
      const from =
        process.env.RESEND_FROM_EMAIL ?? "Scandify <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [resendTo],
          subject: "[Scandify] Pendaftaran early access",
          text: `Email: ${email}\nWaktu: ${new Date().toISOString()}`,
        }),
      });
      if (!res.ok) {
        console.error("[early-access] Resend", res.status, await res.text());
        return { ok: false, message: "Gagal mendaftar. Coba lagi sebentar lagi." };
      }
      stored = true;
    } catch (e) {
      console.error("[early-access] Resend", e);
      return { ok: false, message: "Gagal mendaftar. Coba lagi sebentar lagi." };
    }
  } else if (process.env.NODE_ENV === "development") {
    try {
      const dir = path.join(process.cwd(), "data");
      await mkdir(dir, { recursive: true });
      await appendFile(
        path.join(dir, "early-access.jsonl"),
        `${JSON.stringify({ email, at: new Date().toISOString() })}\n`,
      );
      stored = true;
    } catch (e) {
      console.error("[early-access] file", e);
      return { ok: false, message: "Gagal menyimpan lokal. Periksa izin folder data/." };
    }
  }

  if (!stored) {
    console.error(
      "[early-access] Belum dikonfigurasi: EARLY_ACCESS_WEBHOOK_URL, atau RESEND_API_KEY + EARLY_ACCESS_NOTIFY_EMAIL (produksi), atau jalankan npm run dev untuk file data/early-access.jsonl.",
    );
    return {
      ok: false,
      message:
        "Pendaftaran belum diaktifkan di server ini. Silakan coba lagi nanti atau hubungi pemilik produk.",
    };
  }

  return {
    ok: true,
    message: "Terima kasih! Kami akan kabari lewat email saat beta siap.",
  };
}
