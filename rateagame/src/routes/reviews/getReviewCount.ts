import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { apikeycheck } from "../helpers/apikeycheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const getReviewCount = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { gameId, gamePass } = requestData;

  if (gameId && gamePass) {
    let check = await apikeycheck(c);
    if (!check) {
      return c.json({ success: false }, 500);
    }

    const total = await prisma.review.count({
      where: {
        [gamePass ? "gamePassId" : "gameId"]: String(gameId),
        deleted: false,
      },
    });
    return c.json({ success: true, total }, 200);
  } else {
    return c.json({ success: false }, 500);
  }
};
