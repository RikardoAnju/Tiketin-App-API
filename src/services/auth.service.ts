import bcrypt from "bcryptjs";
import { UserRepository } from "@/src/repositories/user.repository";
import { sendWhatsappMessage } from "@/src/services/fonte.service";
import { AuthResponse, BasicMessageResponse, RegisterResponse } from "@/src/types";
import { generateToken } from "@/src/utils/jwt";
import { compareOtp, generateOtp, hashOtp } from "@/src/utils/otp";
import { normalizePhone } from "@/src/utils/phone";
import { generatePublicId } from "@/src/utils/public-id";
import {
  LoginRequest,
  RegisterRequest,
  ResendOtpRequest,
  VerifyPhoneRequest,
} from "@/src/validators/auth.validator";

export class AuthService {
  static async register(req: RegisterRequest): Promise<RegisterResponse> {
    const normalizedPhone = normalizePhone(req.phone);
    const exists = await UserRepository.existsByEmailOrPhone(req.email, normalizedPhone);

    if (exists) {
      throw new Error("Email atau nomor HP sudah terdaftar");
    }

    const totalUsers = await UserRepository.countUsers();
    const publicId = generatePublicId("USR", totalUsers + 1);
    const passwordHash = await bcrypt.hash(req.password, 10);
    const otp = generateOtp(6);
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const account = await UserRepository.createUser({
      publicId,
      email: req.email,
      phone: normalizedPhone,
      passwordHash,
      name: req.name,
    });

    await UserRepository.createPhoneOtp({
      accountId: account.id,
      otpHash,
      expiresAt,
    });

    if (process.env.FONNTE_TOKEN) {
      await sendWhatsappMessage({
        target: normalizedPhone,
        message: `Kode OTP ${process.env.APP_NAME || "Tiketin"} kamu adalah ${otp}. Berlaku 5 menit.`,
      });
    }

    return {
      message: process.env.FONNTE_TOKEN
        ? "Register berhasil. OTP sudah dikirim ke WhatsApp."
        : "Register berhasil. FONNTE_TOKEN belum diisi, jadi OTP ditampilkan untuk development.",
      account: {
        id: account.id,
        publicId: account.publicId,
        email: account.email,
        phone: account.phone,
        status: account.status,
        accountType: account.accountType,
        name: account.userProfile?.fullName ?? null,
      },
      ...(process.env.NODE_ENV !== "production" ? { devOtp: otp } : {}),
    };
  }

  static async verifyPhone(req: VerifyPhoneRequest): Promise<BasicMessageResponse> {
    const account = await UserRepository.findByEmail(req.email);

    if (!account) {
      throw new Error("Akun tidak ditemukan");
    }

    const latestOtp = await UserRepository.findLatestActiveOtp(account.id);

    if (!latestOtp) {
      throw new Error("OTP tidak ditemukan");
    }

    if (latestOtp.expiresAt < new Date()) {
      throw new Error("OTP sudah kedaluwarsa");
    }

    if (latestOtp.attempts >= 5) {
      throw new Error("Batas percobaan OTP terlampaui");
    }

    const isValid = await compareOtp(req.otp, latestOtp.otpHash);

    if (!isValid) {
      await UserRepository.incrementOtpAttempts(latestOtp.id);
      throw new Error("OTP salah");
    }

    await UserRepository.markOtpVerified(latestOtp.id);
    await UserRepository.activateUser(account.id);

    return {
      message: "Nomor berhasil diverifikasi",
    };
  }

  static async resendOtp(req: ResendOtpRequest): Promise<BasicMessageResponse & { devOtp?: string }> {
    const account = await UserRepository.findByEmail(req.email);

    if (!account) {
      throw new Error("Akun tidak ditemukan");
    }

    if (account.phoneVerifiedAt) {
      throw new Error("Nomor sudah terverifikasi");
    }

    const otp = generateOtp(6);
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await UserRepository.createPhoneOtp({
      accountId: account.id,
      otpHash,
      expiresAt,
    });

    if (process.env.FONNTE_TOKEN) {
      await sendWhatsappMessage({
        target: account.phone,
        message: `Kode OTP baru ${process.env.APP_NAME || "Tiketin"} kamu adalah ${otp}. Berlaku 5 menit.`,
      });
    }

    return {
      message: process.env.FONNTE_TOKEN
        ? "OTP baru sudah dikirim"
        : "OTP baru dibuat untuk development karena FONNTE_TOKEN belum diisi.",
      ...(process.env.NODE_ENV !== "production" ? { devOtp: otp } : {}),
    };
  }

  static async login(req: LoginRequest): Promise<AuthResponse> {
    const account = await UserRepository.findByEmail(req.email);

    if (!account) {
      throw new Error("Email atau password salah");
    }

    const passwordMatch = await bcrypt.compare(req.password, account.passwordHash);

    if (!passwordMatch) {
      throw new Error("Email atau password salah");
    }

    if (account.accountType !== "USER") {
      throw new Error("Login mobile hanya untuk user");
    }

    if (account.status !== "ACTIVE" || !account.phoneVerifiedAt) {
      throw new Error("Akun belum aktif. Silakan verifikasi OTP terlebih dahulu");
    }

    const updatedAccount = await UserRepository.updateLastLogin(account.id);
    const token = generateToken(updatedAccount.id, updatedAccount.email);

    return {
      token,
      account: {
        id: updatedAccount.id,
        publicId: updatedAccount.publicId,
        email: updatedAccount.email,
        phone: updatedAccount.phone,
        accountType: updatedAccount.accountType,
        status: updatedAccount.status,
        name: updatedAccount.userProfile?.fullName ?? null,
      },
    };
  }
}
