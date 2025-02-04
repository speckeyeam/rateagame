import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

import { getRecentlyReviewed } from "./chartTypes/getRecentlyReviewed";
const prisma = new PrismaClient();

export const getCharts = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    gameId,
    userId,
    gamePass, // Default to false if not provided
    token,
    call,
  } = requestData;

  console.log(token);
  if (gameId && userId && token && call) {
    let player: any = await playerCheck(userId, token);
    if (player) {
      if (call == "images") {
        const recentlyReviewed = getRecentlyReviewed(c);

        //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc

        return c.json({ success: false, recentlyReviewed }, 500);
      } else {
      }
    }
  }
  return c.json({ success: false }, 500);
};
