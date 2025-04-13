import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

import { mostLiked } from "./chartTypes/getMostLiked";
import { mostAwarded } from "./chartTypes/getMostAwarded";

const prisma = new PrismaClient();

export const getCharts = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const authHeader = c.req.header("Authorization") ?? "";

  // Quickly check if it starts with "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const key = authHeader.slice("Bearer ".length);

  if (key == process.env.MY_API_KEY) {
    let player: any = await playerCheck(c);
    if (player) {
      const weeklyMostAwarded = await mostAwarded(c, 7);
      const weeklytMostLiked = await mostLiked(c, 7);

      const monthlyMostAwarded = await mostAwarded(c, 30);
      const monthlytMostLiked = await mostLiked(c, 30);

      //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc
      return c.json(
        {
          success: true,
          weeklyMostAwarded,
          weeklytMostLiked,
          monthlyMostAwarded,
          monthlytMostLiked,
        },
        200
      );
    }
  }
  return c.json({ success: false }, 500);
};
