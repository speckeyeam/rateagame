import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { apikeycheck } from "../helpers/apikeycheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const getProfile = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId } = requestData;

  if (userId) {
    let apiCheck: any = await apikeycheck(c);
    if (apiCheck) {
      const [
        totalReviews = 0,
        totalLikes = 0,
        totalAwardsReceived = 0,
        totalAwardsGiven = 0,
      ] = await Promise.all([
        prisma.review.count({
          where: { userId: userId.toString(), deleted: false },
        }),

        prisma.like.count({
          where: {
            review: {
              userId: userId.toString(),
            },
          },
        }),

        prisma.award.count({
          where: {
            receivedUserId: userId.toString(),
            NOT: { givenUserId: userId.toString() },
          },
        }),

        prisma.award.count({
          where: { givenUserId: userId.toString() },
        }),
      ]);
      const user = await prisma.user.findUnique({
        where: { userId: String(userId) },
      });
      const dateJoined =
        user?.dateJoined instanceof Date
          ? Math.floor(user.dateJoined.getTime() / 1000)
          : 0;
      return c.json(
        {
          success: true,
          totalReviews,
          totalLikes,
          totalAwardsGiven,
          totalAwardsReceived,
          dateJoined,
        },
        200
      );
    }
  }
  return c.json({ success: false }, 500);
};
