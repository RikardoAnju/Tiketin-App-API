import { NextRequest } from "next/server";
import { AuthService } from "@/src/services/auth.service";
import {
  loginSchema,
  registerSchema,
  resendOtpSchema,
  verifyPhoneSchema,
} from "@/src/validators/auth.validator";
import { errorResponse, successResponse } from "@/src/utils/response";

export class AuthController {
  static async register(request: NextRequest) {
    try {
      const body = await request.json();
      const parsed = registerSchema.safeParse(body);

      if (!parsed.success) {
        return errorResponse(parsed.error.errors[0].message, 400);
      }

      const result = await AuthService.register(parsed.data);
      return successResponse(result, 201);
    } catch (error: any) {
      const message = error?.message || "Internal server error";
      const status =
        message === "Email atau nomor HP sudah terdaftar"
          ? 400
          : 500;

      return errorResponse(message, status, error);
    }
  }

  static async verifyPhone(request: NextRequest) {
    try {
      const body = await request.json();
      const parsed = verifyPhoneSchema.safeParse(body);

      if (!parsed.success) {
        return errorResponse(parsed.error.errors[0].message, 400);
      }

      const result = await AuthService.verifyPhone(parsed.data);
      return successResponse(result, 200);
    } catch (error: any) {
      const message = error?.message || "Verifikasi OTP gagal";
      const status =
        message === "Akun tidak ditemukan" ||
        message === "OTP tidak ditemukan" ||
        message === "OTP sudah kedaluwarsa" ||
        message === "Batas percobaan OTP terlampaui" ||
        message === "OTP salah"
          ? 400
          : 500;

      return errorResponse(message, status, error);
    }
  }

  static async resendOtp(request: NextRequest) {
    try {
      const body = await request.json();
      const parsed = resendOtpSchema.safeParse(body);

      if (!parsed.success) {
        return errorResponse(parsed.error.errors[0].message, 400);
      }

      const result = await AuthService.resendOtp(parsed.data);
      return successResponse(result, 200);
    } catch (error: any) {
      const message = error?.message || "Gagal mengirim ulang OTP";
      const status =
        message === "Akun tidak ditemukan" || message === "Nomor sudah terverifikasi"
          ? 400
          : 500;

      return errorResponse(message, status, error);
    }
  }

  static async login(request: NextRequest) {
    try {
      const body = await request.json();
      const parsed = loginSchema.safeParse(body);

      if (!parsed.success) {
        return errorResponse(parsed.error.errors[0].message, 400);
      }

      const result = await AuthService.login(parsed.data);
      return successResponse(result, 200);
    } catch (error: any) {
      const message = error?.message || "Email atau password salah";
      const status =
        message === "Email atau password salah" ||
        message === "Akun belum aktif. Silakan verifikasi OTP terlebih dahulu" ||
        message === "Login mobile hanya untuk user"
          ? 401
          : 500;

      return errorResponse(message, status, error);
    }
  }
}
