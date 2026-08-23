import { prisma } from "@/src/utils/prisma";

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.account.findUnique({
      where: { email },
      include: { userProfile: true },
    });
  }

  static async existsByEmailOrPhone(email: string, phone: string): Promise<boolean> {
    const account = await prisma.account.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
      select: { id: true },
    });

    return !!account;
  }

  static async countUsers() {
    return prisma.account.count({
      where: { accountType: "USER" },
    });
  }

  static async createUser(data: {
    publicId: string;
    email: string;
    phone: string;
    passwordHash: string;
    name: string;
  }) {
    return prisma.account.create({
      data: {
        publicId: data.publicId,
        accountType: "USER",
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        status: "INACTIVE",
        userProfile: {
          create: {
            fullName: data.name,
          },
        },
      },
      include: {
        userProfile: true,
      },
    });
  }

  static async createPhoneOtp(data: {
    accountId: string;
    otpHash: string;
    expiresAt: Date;
  }) {
    return prisma.phoneVerificationOtp.create({
      data,
    });
  }

  static async findLatestActiveOtp(accountId: string) {
    return prisma.phoneVerificationOtp.findFirst({
      where: {
        accountId,
        verifiedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async incrementOtpAttempts(otpId: string) {
    return prisma.phoneVerificationOtp.update({
      where: { id: otpId },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }

  static async markOtpVerified(otpId: string) {
    return prisma.phoneVerificationOtp.update({
      where: { id: otpId },
      data: {
        verifiedAt: new Date(),
      },
    });
  }

  static async activateUser(accountId: string) {
    return prisma.account.update({
      where: { id: accountId },
      data: {
        phoneVerifiedAt: new Date(),
        status: "ACTIVE",
      },
      include: {
        userProfile: true,
      },
    });
  }

  static async updateLastLogin(accountId: string) {
    return prisma.account.update({
      where: { id: accountId },
      data: {
        lastLoginAt: new Date(),
      },
      include: {
        userProfile: true,
      },
    });
  }
}
