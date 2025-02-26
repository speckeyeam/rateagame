import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const getProfile = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token } = requestData;

  if (userId && token) {
    let player: any = await playerCheck(c);
    if (player) {
      const [
        totalReviews = 0,
        totalLikes = 0,
        totalAwardsReceived = 0,
        totalAwardsGiven = 0,
      ] = await Promise.all([
        prisma.review.count({
          where: { userId },
        }),

        prisma.like.count({
          where: {
            review: {
              userId,
            },
          },
        }),

        prisma.award.count({
          where: { receivedUserId: userId },
        }),

        prisma.award.count({
          where: { givenUserId: userId },
        }),
      ]);

      return c.json(
        {
          success: true,
          totalReviews,
          totalLikes,
          totalAwardsGiven,
          totalAwardsReceived,
        },
        200
      );
    }
  }
  return c.json({ success: false }, 500);
};
