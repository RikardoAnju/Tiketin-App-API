import { NextRequest } from "next/server";
import { AuthService } from "@/src/services/auth.service";
import { registerSchema, loginSchema } from "@/src/validators/auth.validator";
import { successResponse, errorResponse } from "@/src/utils/response";

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
      const status = error.message === "Email already registered" ? 400 : 500;
      return errorResponse(error.message || "Internal server error", status, error);
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
      return errorResponse(error.message || "Invalid email or password", 401, error);
    }
  }
}
