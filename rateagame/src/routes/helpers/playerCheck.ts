import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function playerCheck(userId: string, token: string) {
  if (userId.length > 100) {
    return null;
  }
  const user = await prisma.user.findUnique({ where: { userId, token } });
  if (!user) {
    return false;
  } else {
    return user;
  }
}

//prob need a way to deal with session tokens and maybe use datastores for that
