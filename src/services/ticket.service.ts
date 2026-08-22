import { TicketRepository } from "@/src/repositories/ticket.repository";
import { EventRepository } from "@/src/repositories/event.repository";
import { PurchaseTicketRequest } from "@/src/validators/ticket.validator";

export class TicketService {
  static async getMyTickets(userId: string) {
    return TicketRepository.findByUserId(userId);
  }

  static async purchase(userId: string, req: PurchaseTicketRequest) {
    const { event_id, quantity } = req;

    const quota = await EventRepository.findQuotaById(event_id);
    if (quota === null) {
      throw new Error("Event not found");
    }
    if (quota < quantity) {
      throw new Error("Not enough quota");
    }

    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      const ticket = await TicketRepository.create({
        eventId: event_id,
        userId,
        status: "paid",
      });
      tickets.push(ticket);
    }

    await EventRepository.decrementQuota(event_id, quota - quantity);

    return { ticket_ids: tickets.map((t) => t.id) };
  }
}
