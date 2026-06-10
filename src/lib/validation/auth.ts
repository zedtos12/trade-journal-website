import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name minimal 2 karakter").max(80),
    email: z.string().trim().toLowerCase().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter").max(128),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

const loginIdentifierSchema = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const normalized = value.trim().toLowerCase();
  if (normalized === "admin") return "admin@tradejournal.local";
  return normalized;
}, z.string().email("Email tidak valid"));

export const loginSchema = z.object({
  email: loginIdentifierSchema,
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const optionalPassword = z.preprocess((value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}, z.string().min(8, "Password minimal 8 karakter").max(128).optional());

export const profileSettingsSchema = z
  .object({
    name: z.string().trim().min(2, "Name minimal 2 karakter").max(80),
    preferredCurrency: z.enum(["USD", "IDR"]),
    currentPassword: optionalPassword,
    newPassword: optionalPassword,
    confirmNewPassword: optionalPassword,
  })
  .refine((data) => !data.newPassword || Boolean(data.currentPassword), {
    message: "Password lama wajib diisi untuk mengganti password",
    path: ["currentPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Konfirmasi password baru tidak sama",
    path: ["confirmNewPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
