import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  date: z.string().datetime("Invalid date"),
  price: z.number().min(0, "Price must be positive"),
  quota: z.number().min(1, "Quota must be at least 1"),
  image_url: z.string().url("Invalid image URL").optional(),
});

export type CreateEventRequest = z.infer<typeof createEventSchema>;
