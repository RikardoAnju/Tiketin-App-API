import { prisma } from "@/src/utils/prisma";

export class TicketRepository {
  static async findByUserId(userId: string) {
    return prisma.ticket.findMany({ where: { userId } });
  }

  static async create(data: { eventId: string; userId: string; status: "pending" | "paid" | "canceled" }) {
    return prisma.ticket.create({ data });
  }
}
