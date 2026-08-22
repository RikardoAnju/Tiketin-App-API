import { NextRequest } from "next/server";
import { EventService } from "@/src/services/event.service";
import { createEventSchema } from "@/src/validators/event.validator";
import { verifyAuth } from "@/src/middleware/auth.middleware";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/src/utils/response";

export class EventController {
  static async getAll(request: NextRequest) {
    try {
      const events = await EventService.getAll();
      return successResponse(events);
    } catch (error: any) {
      return errorResponse(error.message || "Internal server error", 500, error);
    }
  }

  static async getById(id: string) {
    try {
      const event = await EventService.getById(id);
      return successResponse(event);
    } catch (error: any) {
      return notFoundResponse(error.message || "Event not found");
    }
  }

  static async create(request: NextRequest) {
    try {
      const auth = verifyAuth(request);
      if (!auth) return unauthorizedResponse();

      const body = await request.json();
      const parsed = createEventSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(parsed.error.errors[0].message, 400);
      }

      const result = await EventService.create(parsed.data);
      return successResponse(result, 201);
    } catch (error: any) {
      return errorResponse(error.message || "Internal server error", 500, error);
    }
  }
}
