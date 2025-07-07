//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const getMostLiked = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    take = 45,
    ascending = false,
    costRobux = false,
    days,
    visits = 0,
    reviews = 0,
    cursor = null,
  } = requestData;
  let now = new Date();
  const games = await prisma.review.groupBy({
    by: ["gameId", "assetId"],

    _sum: { rating: true },
    _avg: { rating: true },
    _count: { _all: true },
    orderBy: {
      _sum: {
        rating: ascending ? "asc" : "desc", // Order by highest total rating
      },
    },
    cursor: cursor ? { gameId: cursor } : undefined,
    skip: cursor ? 1 : 0, // Skip the cursor item itself

    where: {
      // [gamePass ? "gameId" : "gamePassId"]: null,
      gamePassId: null,

      time: {
        lte: now,
        ...(days <= 365 && {
          // add gte only when days ≤ 365
          gte: new Date(now.getTime() - days * 86400000),
        }),
      },
      game: {
        is: {
          forSale: costRobux,
          visits: { gt: visits - 1 },
        },
        _count: {
          reviews: { gte: reviews - 1 },
        },
      },
      deleted: false,
    },

    take,
  });
  return { games, nextCursor: games[games.length - 1].gameId };
};
