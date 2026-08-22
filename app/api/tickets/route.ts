import { NextRequest } from "next/server";
import { TicketController } from "@/src/controllers/ticket.controller";

export async function GET(request: NextRequest) {
  return TicketController.getMyTickets(request);
}

export async function POST(request: NextRequest) {
  return TicketController.purchase(request);
}
