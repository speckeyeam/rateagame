//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const recentlyReviewed = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    userId,
    gamePass, // Default to false if not provided,
    date,
  } = requestData;

  if (userId && date) {
    const data: any = {
      by: ["gameId", "assetId"],
      orderBy: {
        time: "desc", // Orders in descending order (newest first)
      },
      where: {
        time: {
          lt: new Date(date * 1000),
        },
        userId: userId.toString(),
        deleted: false,
      },
      take: 100,
    };

    const recentlyReviewed = await prisma.review.groupBy(data);
    if (recentlyReviewed) {
      return { games: recentlyReviewed };
    }
  }

  return null;
};
