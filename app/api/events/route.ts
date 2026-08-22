import { NextRequest } from "next/server";
import { EventController } from "@/src/controllers/event.controller";

export async function GET(request: NextRequest) {
  return EventController.getAll(request);
}

export async function POST(request: NextRequest) {
  return EventController.create(request);
}
