import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { apikeycheck } from "../helpers/apikeycheck";

const prisma = new PrismaClient();

export const isGameSaved = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    gameId,
    userId,
    gamePass, // Default to false if not provided
  } = requestData;

  if (gameId && userId) {
    let check: any = await apikeycheck(c);
    if (check) {
      console.log(requestData);

      const data: any = {
        userId: String(userId),
        gameId: String(gameId),
      };
      if (gamePass) {
        data.gamePassId = String(gameId);
      } else {
        data.gameId = String(gameId);
      }

      const saveCheck = await prisma.saved.findFirst({
        where: data,
      });
      if (saveCheck) {
        //user has game saved
        return c.json({ success: true }, 200);
      } else {
        //user does not have game saved
        return c.json({ success: false }, 200);
      }
    }
  }
  return c.json({ success: false }, 500);
};
