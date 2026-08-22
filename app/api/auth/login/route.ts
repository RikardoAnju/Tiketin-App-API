import { NextRequest } from "next/server";
import { AuthController } from "@/src/controllers/auth.controller";

export async function POST(request: NextRequest) {
  return AuthController.login(request);
}
