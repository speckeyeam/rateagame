//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days

export const recentlyReviewed = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, date } = requestData;

  if (userId && date) {
    console.log("test");
    const data: any = {
      where: {
        time: {
          lt: new Date(date * 1000),
        },
        userId: userId.toString(),
        deleted: false,
      },
      include: {
        _count: {
          select: { likes: { where: { value: true } } }, // Include the number of likes for each review
        },
        likes: {
          where: { userId: userId.toString(), value: true }, // Check if the user has liked the review
          select: { userId: true }, // Select userId to determine if a like exists
        },
      },
      orderBy: {
        time: "desc", // Orders in descending order (newest first)
      },
      take: 100,
    };

    const recentlyReviewed = await prisma.review.findMany(data);
    console.log("test2");
    if (recentlyReviewed) {
      return c.json({ success: true, games: recentlyReviewed }, 200);
    }
  }

  return c.json({ success: false }, 500);
};
