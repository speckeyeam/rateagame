import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const getFeed = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token, cursor = null } = await requestData;

  console.log(requestData);
  if (userId && token) {
    let player: any = await playerCheck(c);
    if (player) {
      let data = {
        where: {
          deleted: false,
          userId: { not: userId.toString() },
          viewed: {
            none: {
              userId: userId.toString(),
            },
          },
        },

        take: 100,
      };
      if (cursor) {
        data.skip = cursor ? 1 : 0; // Skip the cursor item itself
        data.cursor = cursor;
      }
      const unviewedReviews = await prisma.review.findMany(data);
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
