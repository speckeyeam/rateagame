import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const getFeed = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token, call, cursor = null } = await requestData;

  console.log(requestData);
  if (userId && token && call) {
    let player: any = await playerCheck(c);
    if (player) {
      const unviewedReviews = await prisma.review.findMany({
        where: {
          deleted: false,
          userId: { not: userId },
          viewed: {
            none: {
              userId: userId,
            },
          },
        },
        skip: cursor ? 1 : 0, // Skip the cursor item itself
        cursor: cursor,
        take: 100,
      });
      return c.json(
        {
          success: true,
          reviews: unviewedReviews,
          nextCursor: unviewedReviews[unviewedReviews.length - 1],
        },
        200
      );
    }
  }
  return c.json({ success: false }, 500);
};
