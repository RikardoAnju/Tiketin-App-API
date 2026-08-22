import { EventRepository } from "@/src/repositories/event.repository";
import { CreateEventRequest } from "@/src/validators/event.validator";

export class EventService {
  static async getAll() {
    return EventRepository.findAll();
  }

  static async getById(id: string) {
    const event = await EventRepository.findById(id);
    if (!event) throw new Error("Event not found");
    return event;
  }

  static async create(req: CreateEventRequest) {
    return EventRepository.create({
      title: req.title,
      description: req.description,
      location: req.location,
      date: new Date(req.date),
      price: req.price,
      quota: req.quota,
      imageUrl: req.image_url || null,
    });
  }
}
