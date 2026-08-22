import { prisma } from "@/src/utils/prisma";

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async existsByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  static async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({ data });
  }
}
