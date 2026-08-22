import bcrypt from "bcryptjs";
import { UserRepository } from "@/src/repositories/user.repository";
import { generateToken } from "@/src/utils/jwt";
import { RegisterRequest, LoginRequest } from "@/src/validators/auth.validator";
import { AuthResponse } from "@/src/types";

export class AuthService {
  static async register(req: RegisterRequest): Promise<AuthResponse> {
    const exists = await UserRepository.existsByEmail(req.email);
    if (exists) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(req.password, 10);

    const user = await UserRepository.create({
      name: req.name,
      email: req.email,
      password: hashedPassword,
    });

    const token = generateToken(user.id, user.email);
    return { token };
  }

  static async login(req: LoginRequest): Promise<AuthResponse> {
    const user = await UserRepository.findByEmail(req.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(req.password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id, user.email);
    return { token };
  }
}
