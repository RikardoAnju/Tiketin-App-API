import { NextRequest } from "next/server";
import { TicketService } from "@/src/services/ticket.service";
import { purchaseTicketSchema } from "@/src/validators/ticket.validator";
import { verifyAuth } from "@/src/middleware/auth.middleware";
import { successResponse, errorResponse, unauthorizedResponse } from "@/src/utils/response";

export class TicketController {
  static async getMyTickets(request: NextRequest) {
    try {
      const auth = verifyAuth(request);
      if (!auth) return unauthorizedResponse();

      const tickets = await TicketService.getMyTickets(auth.userId);
      return successResponse(tickets);
    } catch (error: any) {
      return errorResponse(error.message || "Internal server error", 500, error);
    }
  }

  static async purchase(request: NextRequest) {
    try {
      const auth = verifyAuth(request);
      if (!auth) return unauthorizedResponse();

      const body = await request.json();
      const parsed = purchaseTicketSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(parsed.error.errors[0].message, 400);
      }

      const result = await TicketService.purchase(auth.userId, parsed.data);
      return successResponse(result, 201);
    } catch (error: any) {
      const status =
        error.message === "Event not found"
          ? 404
          : error.message === "Not enough quota"
          ? 400
          : 500;
      return errorResponse(error.message || "Internal server error", status, error);
    }
  }
}
