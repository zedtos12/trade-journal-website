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

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
