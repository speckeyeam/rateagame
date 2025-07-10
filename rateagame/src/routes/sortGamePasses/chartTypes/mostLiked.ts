//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const getMostLiked = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    take = 100,
    ascending = false,
    costRobux = false,
    date,
    visits = 0,
    reviews = 0,
    cursor = 0,
  } = requestData;
  let now = new Date();

  const games = await prisma.review.groupBy({
    by: ["gamePassId", "assetId"],

    _sum: { rating: true },
    _avg: { rating: true },
    _count: { _all: true },
    having: {
      gamePassId: {
        // <-- must be in `by`
        _count: {
          gte: parseInt(reviews), // min # of reviews you want
        },
      },
    },
    orderBy: {
      _sum: {
        rating: ascending ? "asc" : "desc", // Order by highest total rating
      },
    },

    where: {
      // [gamePass ? "gameId" : "gamePassId"]: null,
      gameId: null,

      time: {
        lte: now,
        ...(date <= 365 && {
          // add gte only when days ≤ 365
          gte: new Date(now.getTime() - date * 86400000),
        }),
      },
      game: {
        is: {
          forSale: costRobux,
          visits: { gt: visits - 1 },
        },
      },
      deleted: false,
    },
    skip: parseInt(cursor) * 100,
    take,
  });
  return { games, nextCursor: cursor + 1 };
};
