import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { apikeycheck } from "../helpers/apikeycheck";

const prisma = new PrismaClient();

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 86 400 000 ms

function isOverADayOld(date: Date): boolean {
  return Date.now() - date.getTime() > ONE_DAY_MS;
}

export const getCache = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { gameId } = requestData;

  if (gameId) {
    let check: any = await apikeycheck(c);
    if (check) {
      const game = await prisma.game.findFirst({
        where: {
          gameId: String(gameId),
        },
      });
      if (game) {
        return c.json(
          { success: true, game, outdated: isOverADayOld(game.lastUpdated) },
          200
        );
      }
    }
  }
  return c.json({ success: false }, 500);
};
