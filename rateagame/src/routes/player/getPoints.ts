import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const getPoints = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token } = requestData;

  if (userId && token) {
    let player: any = await playerCheck(userId, token);
    if (player) {
      return c.json({ success: true, points: player.points }, 200);
    }
  }
  return c.json({ success: false }, 500);
};
