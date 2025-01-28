import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function playerCheck(userId: string) {
  if (userId.length > 100) {
    return null;
  }
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) {
    const newuser = await prisma.user.create({
      data: {
        userId,
        dateJoined: new Date(),
        coins: 150,
      },
    });
    return newuser;
  } else {
    return user;
  }
}

//prob need a way to deal with session tokens and maybe use datastores for that
