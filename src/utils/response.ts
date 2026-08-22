import { NextResponse } from "next/server";
import { ApiResponse } from "@/src/types";

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json<ApiResponse<T>>({ data }, { status });
}

export function errorResponse(message: string, status: number = 400, error?: any) {
  return NextResponse.json<ApiResponse<null>>(
    { data: null, error: message, message: error?.message || message },
    { status }
  );
}

export function notFoundResponse(message: string = "Not found") {
  return errorResponse(message, 404);
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Forbidden") {
  return errorResponse(message, 403);
}
