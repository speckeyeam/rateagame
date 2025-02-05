import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

import { getRecentlyReviewed } from "./chartTypes/getRecentlyReviewed";
import { getTopRated } from "./chartTypes/getTopRated";
import { getLowestRated } from "./chartTypes/getLowestRated";
import { getTrending } from "./chartTypes/getTrending";
const prisma = new PrismaClient();

export const getCharts = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token, call } = requestData;

  console.log(token);
  if (userId && token && call) {
    let player: any = await playerCheck(userId, token);
    if (player) {
      if (call == "images") {
        const recentlyReviewed = getRecentlyReviewed(c);
        const topRated = getTopRated(c);
        const lowestRated = getLowestRated(c);
        const trending = getTrending(c, 7);
        const mostReviewed = getTrending(c, 219000000000); //guess im pretty short sighted by assuming that my game wont be used in 600 million fucking years

        //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc
        console.log(recentlyReviewed);
        return c.json(
          {
            success: true,
            recentlyReviewed,
            topRated,
            lowestRated,
            trending,
            mostReviewed,
          },
          200
        );
      } else {
      }
    }
  }
  return c.json({ success: false }, 500);
};
