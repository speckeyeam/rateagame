//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days

export const recentlyReviewed = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null);

  const { userId, date } = requestData;

  if (!userId || !date) {
    return c.json({ success: false }, 500);
  }

  const recentlyReviewed = await prisma.review.findMany({
    where: {
      time: {
        lt: new Date(date * 1000),
      },
      userId: userId.toString(),
      deleted: false,
    },
    include: {
      _count: {
        select: { likes: { where: { value: true } } },
      },
      likes: {
        where: { userId: userId.toString(), value: true },
        select: { userId: true },
      },
    },
    orderBy: {
      time: "desc",
    },
    take: 100,
  });

  if (recentlyReviewed) {
    return c.json({ success: true, games: recentlyReviewed }, 200);
  } else {
    return c.json({ success: false }, 500);
  }
};
