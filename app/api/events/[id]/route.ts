import { NextRequest } from "next/server";
import { EventController } from "@/src/controllers/event.controller";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return EventController.getById(id);
}
