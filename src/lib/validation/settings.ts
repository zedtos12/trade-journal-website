import { z } from "zod";

export const profileSettingsSchema = z.object({
  name: z.string().trim().min(2, "Name minimal 2 karakter").max(80),
  preferredCurrency: z.enum(["USD", "IDR"]),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(8, "Password lama minimal 8 karakter"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter").max(128),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password baru tidak sama",
    path: ["confirmPassword"],
  });

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
