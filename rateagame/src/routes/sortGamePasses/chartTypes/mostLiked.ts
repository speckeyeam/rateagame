//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const getMostLiked = async (c: Context) => {
  const {
    take = 100,
    ascending = false,
    date, // optional
    reviews = 0,
    cursor = 0,
  } = (await c.req.json().catch(() => ({}))) as Record<string, any>;

  const now = new Date();

  const games = await prisma.review.groupBy({
    by: ["gamePassId", "assetId"],
    _sum: { rating: true },
    _avg: { rating: true },
    _count: { _all: true },

    having: {
      _count: { _all: { gte: Number(reviews) } },
    },
    orderBy: {
      _sum: { rating: ascending ? "asc" : "desc" },
    },

    where: {
      gamePassId: { not: null }, // key change
      deleted: false,
      ...(typeof date === "number" &&
        date > 0 && {
          time: {
            lte: now,
            ...(date <= 365 && {
              gte: new Date(now.getTime() - date * 86_400_000),
            }),
          },
        }),
    },

    skip: Number(cursor) * take,
    take,
  });

  return { games, nextCursor: Number(cursor) + 1 };
};
