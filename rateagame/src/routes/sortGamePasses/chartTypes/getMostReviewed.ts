//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const getMostReviewed = async (c: Context) => {
  const {
    take = 100,
    ascending = false,
    reviews = 0,
    cursor = 0,
    date = 7,
  } = await c.req.json().catch(() => ({}));

  const startDate = date > 0 ? new Date(Date.now() - date * 86_400_000) : null; // 24 h × 60 m × 60 s × 1000 ms

  const games = await prisma.review.groupBy({
    by: ["gamePassId", "assetId"],
    _sum: { rating: true },
    _avg: { rating: true },
    _count: { _all: true },

    having: {
      _count: { _all: { gte: reviews } },
    },

    orderBy: {
      _count: { _all: ascending ? "asc" : "desc" },
    },

    where: {
      gamePassId: { not: null }, // <-- key change
      deleted: false,
      ...(startDate && { time: { gte: startDate } }),
    },

    skip: Number(cursor) * take,
    take,
  });

  return { games, nextCursor: Number(cursor) + 1 };
};
