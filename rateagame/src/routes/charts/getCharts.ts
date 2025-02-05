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

  const { userId, token, call } = await requestData;

  console.log(requestData);
  if (userId && token && call) {
    let player: any = await playerCheck(userId, token);
    if (player) {
      if (call == "images") {
        const recentlyReviewed = await getRecentlyReviewed(c);
        const topRated = await getTopRated(c);
        const lowestRated = await getLowestRated(c);
        const trending = await getTrending(c, 7);
        const mostReviewed = await getTrending(c, 0);

        //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc
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
      } else if (call == "Recently Reviewed") {
        const recentlyReviewed = await getRecentlyReviewed(c);
        return c.json(
          {
            success: true,
            recentlyReviewed,
          },
          200
        );
      }
    }
  }
  return c.json({ success: false }, 500);
};
