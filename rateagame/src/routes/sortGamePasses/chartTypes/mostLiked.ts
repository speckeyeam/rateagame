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
    date,
    reviews = 0,
    cursor = 0,
  } = requestData;
  const now = new Date();
  const since = date ? new Date(now.getTime() - date * 86_400_000) : undefined;
  const games = await prisma.review.groupBy({
    by: ["gamePassId"], // one row per pass
    where: {
      gamePassId: { not: null },
      deleted: false,
      ...(since && { time: { gte: since, lte: now } }),
    },
    _sum: { rating: true },
    _avg: { rating: true },
    _count: { _all: true },
    having: {
      // keep passes with ≥ N reviews
      _count: { _all: { gte: reviews } },
    },
    orderBy: { _sum: { rating: ascending ? "asc" : "desc" } },
    skip: cursor * take,
    take,
  });
  return { games, nextCursor: cursor + 1 };
};
