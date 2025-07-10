import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { apikeycheck } from "../helpers/apikeycheck";

const prisma = new PrismaClient();

export async function getVisits(id: string | number): Promise<number> {
  let universeId: number | undefined;
  const universeRes = await fetch(
    `https://apis.roblox.com/universes/v1/places/${id}/universe`
  );

  if (universeRes.ok) {
    const { universeId: u } = await universeRes.json();
    universeId = u;
  } else {
    universeId = Number(id); // treat incoming id as universeId
  }
  const gameRes = await fetch(
    `https://games.roblox.com/v1/games?universeIds=${universeId}`
  );
  if (!gameRes.ok) return 0;

  const json = await gameRes.json();
  return json.data?.[0]?.visits ?? 0;
}

export const setCache = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    gameId,
    forSale = false,
    IconImageAssetId,
    Name,
    Created = new Date(),
    Price = 0,
    gamePass = false,
  } = requestData;

  if (gameId && IconImageAssetId && Name) {
    let check: any = await apikeycheck(c);
    if (check) {
      const offset = Math.random() * 12 * 60 * 60 * 1000;
      if (gamePass) {
        const game = await prisma.gamePass.upsert({
          where: {
            gamePassId: gameId.toString(),
          },
          update: {
            IconImageAssetId: IconImageAssetId.toString(),
            Name,
            lastUpdated: new Date(Date.now() + offset),
          },
          create: {
            gamePassId: gameId.toString(),
            date: new Date(Created.toString()),
          },
        });
        if (game) {
          return c.json({ success: true }, 200);
        }
      } else {
        let visits = await getVisits(gameId);

        const game = await prisma.game.upsert({
          where: {
            gameId: gameId.toString(),
          },
          update: {
            forSale,
            IconImageAssetId: IconImageAssetId.toString(),
            Name,
            Created,
            lastUpdated: new Date(Date.now() + offset),
            Price: Number(Price),
            date: new Date(Created.toString()),
            ...(visits !== 0 && { visits }),
          },
          create: {
            gameId: gameId.toString(),
          },
        });
        if (game) {
          return c.json({ success: true }, 200);
        }
      }
    }
  }
  return c.json({ success: false }, 500);
};
