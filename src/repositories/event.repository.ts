import { prisma } from "@/src/utils/prisma";

export class EventRepository {
  static async findAll() {
    return prisma.event.findMany({ orderBy: { date: "asc" } });
  }

  static async findById(id: string) {
    return prisma.event.findUnique({ where: { id } });
  }

  static async findQuotaById(id: string): Promise<number | null> {
    const event = await prisma.event.findUnique({
      where: { id },
      select: { quota: true },
    });
    return event?.quota ?? null;
  }

  static async create(data: {
    title: string;
    description: string;
    location: string;
    date: Date;
    price: number;
    quota: number;
    imageUrl: string | null;
  }) {
    return prisma.event.create({ data });
  }

  static async decrementQuota(id: string, newQuota: number): Promise<void> {
    await prisma.event.update({ where: { id }, data: { quota: newQuota } });
  }
}
