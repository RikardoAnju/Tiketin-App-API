import bcrypt from "bcryptjs";

export function generateOtp(length = 6) {
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }

  return otp;
}

export async function hashOtp(otp: string) {
  return bcrypt.hash(otp, 10);
}

export async function compareOtp(plainOtp: string, otpHash: string) {
  return bcrypt.compare(plainOtp, otpHash);
}
