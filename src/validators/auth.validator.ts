import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor HP minimal 10 digit").max(20, "Nomor HP maksimal 20 digit"),
  password: z.string().min(8, "Password minimal 8 karakter").max(100, "Password maksimal 100 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter").max(100, "Password maksimal 100 karakter"),
});

export const verifyPhoneSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  otp: z.string().regex(/^\d{6}$/, "OTP harus 6 digit angka"),
});

export const resendOtpSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type VerifyPhoneRequest = z.infer<typeof verifyPhoneSchema>;
export type ResendOtpRequest = z.infer<typeof resendOtpSchema>;
