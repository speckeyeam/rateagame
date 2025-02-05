//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../../helpers/playerCheck";
import { gameCheck } from "../../helpers/gameCheck";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const getTrending = async (c: Context, days: number) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    userId,
    gamePass, // Default to false if not provided
    take,
  } = requestData;

  if (userId && take && days) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - days);

    const data: any = {
      by: gamePass ? ["gamePassId"] : ["gameId"],
      take,
      where: {
        time: {
          [days == 0 ? "lte" : "gte"]: oneWeekAgo,
        },
        deleted: false,
      },
      _count: {
        [gamePass ? "gamePassId" : "gameId"]: true, // Count based on grouping field
      },
      orderBy: {
        _count: {
          [gamePass ? "gamePassId" : "gameId"]: "desc", // Sort by the count of the grouping field
        },
      },
    };

    const recentlyReviewed = await prisma.review.groupBy(data);
    // console.log(recentlyReviewed);
    if (recentlyReviewed) {
      return recentlyReviewed;
    }
  }

  return null;
};
