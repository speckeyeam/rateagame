import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { apikeycheck } from "../helpers/apikeycheck";

const prisma = new PrismaClient();

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
        return c.json({ success: true, game }, 200);
      }
    }
  }
  return c.json({ success: false }, 500);
};
