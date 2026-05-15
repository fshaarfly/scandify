/** Map Supabase Auth messages to readable Indonesian copy. */
export function mapAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("invalid login credentials")) {
    return "Email atau kata sandi salah.";
  }
  if (m.includes("email not confirmed")) {
    return "Email belum dikonfirmasi. Periksa kotak masuk Anda.";
  }
  if (m.includes("too many requests")) {
    return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  }
  if (
    m.includes("user already registered") ||
    m.includes("already been registered") ||
    m.includes("email address is already registered")
  ) {
    return "Email ini sudah terdaftar. Gunakan halaman masuk.";
  }
  if (m.includes("password should be at least") || m.includes("password is too short")) {
    return "Kata sandi terlalu pendek. Gunakan minimal 6 karakter (disarankan lebih panjang).";
  }
  if (m.includes("invalid email")) {
    return "Format email tidak valid.";
  }
  if (m.includes("signup_disabled") || m.includes("signups not allowed")) {
    return "Pendaftaran email dinonaktifkan di proyek ini.";
  }

  return message;
}
