//NOTE, THERE IS NO WAY TO LIMIT HOW MANY AWARDS ARE LOADED IN! THERE IS ALSO NO WAY TO GET TTHE MOST RARE AWARDS FIRST BUT THIS ISNT THAT IMPORTANT
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const loadReviewAwards = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token, reviewId } = await requestData;
  console.log("went through");
  if (userId && token && reviewId) {
    let player: any = await playerCheck(userId, token);
    if (player) {
      //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc

      const awards = await prisma.award.groupBy({
        by: ["awardId"], // Group by awardId, ensuring it appears in results
        where: {
          reviewId: reviewId.toString(),
        },
        _count: {
          awardId: true, // Count occurrences of each awardId
        },
      });

      if (awards) {
        return c.json(
          {
            success: true,
            awards,
          },
          200
        );
      }
    }
  }
  return c.json({ success: false }, 500);
};
