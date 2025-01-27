import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function gameCheck(gameId: string, gamePass: boolean) {
  if (userId.length > 100) {
    return null;
  }
  const game = await prisma.game.findUnique({
    where: { gameId: gameId, gamePass },
  });
  if (!game) {
    const newgame = await prisma.game.create({
      data: {
        gameId,
        gamePass,
      },
    });
    return newgame;
  } else {
    return game;
  }
}
