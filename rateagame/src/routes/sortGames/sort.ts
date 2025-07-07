import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

import { getTopRated } from "./chartTypes/newest";
import { getLowestRated } from "./chartTypes/mostLiked";
import { getTrending } from "./chartTypes/leastPopular";
import { getMostReviewed } from "./chartTypes/getMostReviewed";
import { getHighestRating } from "./chartTypes/highestRating";

const prisma = new PrismaClient();

export const sort = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token, call } = await requestData;

  const functions: any = {
    "Most Liked": getMostLiked, //i think get top rated is already done here
    "Least Popular": getLeastPopular,
    "Newest Games": getNewestGames,
    "Most Reviewed": getMostReviewed,
    "Highest Rating": getHighestRating,
  };
  console.log(requestData);
  if (userId && call) {
    // let player: any = await playerCheck(c);
    if (call == "images") {
      const topRated = await getTopRated(c);
      const lowestRated = await getLowestRated(c);
      const trending = await getTrending(c);
      const mostReviewed = await getMostReviewed(c);
      const highestRated = await getHighestRating(c);
      //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc
      return c.json(
        {
          success: true,
          highestRated,
          topRated,
          lowestRated,
          trending,
          mostReviewed,
        },
        200
      );
    } else {
      const data = await functions[call](c);
      return c.json(
        {
          success: true,
          games: data?.games,
          nextCursor: data?.nextCursor,
        },
        200
      );
    }
  }

  return c.json({ success: false }, 500);
};
