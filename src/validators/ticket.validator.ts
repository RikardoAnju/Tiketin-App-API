import { z } from "zod";

export const purchaseTicketSchema = z.object({
  event_id: z.string().uuid("Invalid event ID"),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
});

export type PurchaseTicketRequest = z.infer<typeof purchaseTicketSchema>;
