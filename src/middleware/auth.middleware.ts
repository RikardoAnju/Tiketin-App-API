import { NextRequest } from "next/server";
import { verifyToken, extractToken } from "@/src/utils/jwt";
import { AuthPayload } from "@/src/types";

export function verifyAuth(request: NextRequest): AuthPayload | null {
  const authHeader = request.headers.get("authorization");
  const token = extractToken(authHeader || undefined);

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return { userId: payload.userId, email: payload.email };
}
