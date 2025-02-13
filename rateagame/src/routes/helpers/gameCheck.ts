import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function gameCheck(gameId: string, gamePass: boolean) {
  if (gameId.length > 100) {
    return null;
  }
  if (gamePass) {
    const checkGamePass = await prisma.gamePass.findUnique({
      where: { gamePassId: String(gameId) },
    });
    if (!checkGamePass) {
      const newgame = await prisma.gamePass.create({
        data: {
          gamePassId: String(gameId),
          assetId: String(gameId),
        },
      });
      return newgame;
    }
  } else {
    const game = await prisma.game.findUnique({
      where: { gameId: String(gameId) },
    });
    if (!game) {
      const newgame = await prisma.game.create({
        data: {
          gameId: String(gameId),
          assetId: String(gameId),
        },
      });
    }
  }
}
