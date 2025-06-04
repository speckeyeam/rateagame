//load gamepasses as well
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
    date,
  } = requestData;

  if (userId && take && date) {
    const data: any = {
      orderBy: {
        time: "desc", // Orders in descending order (newest first)
      },
      where: {
        time: {
          lt: new Date(date * 1000),
        },
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

      take,
    };

    const recentlyReviewed = await prisma.review.findMany(data);
    if (recentlyReviewed) {
      return { games: recentlyReviewed };
    }
  }

  return null;
};
