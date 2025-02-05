//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../../helpers/playerCheck";
import { gameCheck } from "../../helpers/gameCheck";

const prisma = new PrismaClient();

export const getRecentlyReviewed = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    userId,
    gamePass, // Default to false if not provided
    take,
    cursor,
  } = requestData;

  if (userId && take) {
    const data: any = {
      orderBy: {
        time: "desc", // Orders in descending order (newest first)
      },
      where: {
        time: {
          lt: new Date(cursor * 1000),
        },
        deleted: false,
      },
      take,
    };
    if (gamePass) {
      data.where.gameId = null;
    } else {
      data.where.gamePassId = null;
    }

    const recentlyReviewed = await prisma.review.findMany(data);
    if (recentlyReviewed) {
      return { games: recentlyReviewed };
    }
  }

  return null;
};
