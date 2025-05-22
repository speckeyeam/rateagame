import { PrismaClient } from "@prisma/client";
import axios from "axios";
const prisma = new PrismaClient();

export async function getGamePrice(
  placeId: number | string
): Promise<{ price: number; forSale: boolean }> {
  const url = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;
  const { data: universeData } = await axios.get<{ universeId: number }>(url, {
    // no auth or cookies needed
    validateStatus: (s) => s === 200,
  });
  if (universeData.universeId) {
    const { data: gameData } = await axios.get(
      "https://games.roblox.com/v1/games",
      {
        params: { universeIds: universeData.universeId },
      }
    );
    const price = gameData.data[0]?.price ?? 0;
    return {
      price,
      forSale: price > 0,
    };
  }
  return { price: 0, forSale: false };
}

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
        },
      });
      return newgame;
    }
  } else {
    const { price, forSale } = await getGamePrice(gameId);
    const game = await prisma.game.upsert({
      where: { gameId: String(gameId) },
      update: {
        price,
        forSale,
      },
      create: {
        gameId: String(gameId),
        price,
        forSale,
      },
    });
    return game;
  }
}
