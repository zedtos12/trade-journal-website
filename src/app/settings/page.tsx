import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { profileSettingsSchema } from "@/lib/validation/auth";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-gold/40 focus:ring-2";
const labelClass = "block text-sm text-slate-300";

function settingsMessage(code?: string) {
  if (code === "updated") return { type: "success", text: "Settings berhasil disimpan." };
  if (code === "invalid") return { type: "error", text: "Data settings tidak valid. Cek nama, currency, dan password." };
  if (code === "password") return { type: "error", text: "Password lama tidak cocok." };
  if (code === "missing") return { type: "error", text: "User tidak ditemukan. Silakan login ulang." };
  return null;
}

async function updateProfileSettings(formData: FormData) {
  "use server";

  const user = await requireUser();
  const parsed = profileSettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) redirect("/settings?status=invalid");

  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!existingUser) redirect("/settings?status=missing");

  const data: { name: string; preferredCurrency: "USD" | "IDR"; passwordHash?: string } = {
    name: parsed.data.name,
    preferredCurrency: parsed.data.preferredCurrency,
  };

  if (parsed.data.newPassword) {
    const passwordMatches = await bcrypt.compare(parsed.data.currentPassword ?? "", existingUser.passwordHash);
    if (!passwordMatches) redirect("/settings?status=password");
    data.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  }

  await prisma.user.update({
    where: { id: user.id },
    data,
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  redirect("/settings?status=updated");
}

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const params = await searchParams;
  const status = Array.isArray(params.status) ? params.status[0] : params.status;
  const message = settingsMessage(status);

  return (
    <AppShell>
      <div className="max-w-4xl">
        <p className="text-gold">Account settings</p>
        <h1 className="mt-2 text-4xl font-semibold">Profile & preferences</h1>
        <p className="mt-2 text-slate-400">Update nama, currency utama, dan password akun dengan aman.</p>
      </div>

      {message && (
        <div className={message.type === "success" ? "mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200" : "mt-8 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"} role="status">
          {message.text}
        </div>
      )}

      <form action={updateProfileSettings} className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]" aria-label="Profile settings form">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="mt-5 grid gap-4">
            <label className={labelClass}>Name
              <input name="name" required minLength={2} maxLength={80} defaultValue={user.name} className={inputClass} autoComplete="name" />
            </label>
            <label className={labelClass}>Email
              <input value={user.email} disabled className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-slate-400" aria-describedby="email-help" />
              <span id="email-help" className="mt-2 block text-xs text-slate-500">Email belum bisa diubah untuk menjaga auth/session tetap aman.</span>
            </label>
            <label className={labelClass}>Preferred currency
              <select name="preferredCurrency" defaultValue={user.preferred_currency} className={inputClass} aria-label="Preferred currency">
                <option value="USD">USD</option>
                <option value="IDR">IDR</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold">Change password</h2>
          <p className="mt-2 text-sm text-slate-400">Opsional. Isi semua field password hanya jika ingin mengganti password.</p>
          <div className="mt-5 grid gap-4">
            <label className={labelClass}>Current password
              <input name="currentPassword" type="password" minLength={8} className={inputClass} autoComplete="current-password" />
            </label>
            <label className={labelClass}>New password
              <input name="newPassword" type="password" minLength={8} maxLength={128} className={inputClass} autoComplete="new-password" />
            </label>
            <label className={labelClass}>Confirm new password
              <input name="confirmNewPassword" type="password" minLength={8} maxLength={128} className={inputClass} autoComplete="new-password" />
            </label>
          </div>
        </section>

        <div className="lg:col-span-2">
          <button className="rounded-full bg-gold px-6 py-3 font-semibold text-slate-950 hover:bg-goldLight">Save Settings</button>
        </div>
      </form>
    </AppShell>
  );
}
