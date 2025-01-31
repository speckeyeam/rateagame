import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const saveGame = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    gameId,
    userId,
    gamePass, // Default to false if not provided
    token,
    save,
    time,
  } = requestData;

  console.log(token);
  if (gameId && userId && token) {
    let player: any = await playerCheck(userId, token);
    if (player) {
      console.log(requestData);

      const data: any = {
        userId: String(userId),
        gameId: String(gameId),
        time: new Date(time * 1000),
      };
      if (gamePass) {
        data.gamePassId = String(gameId);
      } else {
        data.gameId = String(gameId);
      }

      if (save) {
        const newSave = await prisma.saved.upsert({
          where: data,
          update: {},
          create: data,
        });
      } else {
        const deletedSave = await prisma.saved.deleteMany({
          where: data,
        });
      }
      return c.json({ success: true }, 200);
    }
  }
  return c.json({ success: false }, 500);
};
