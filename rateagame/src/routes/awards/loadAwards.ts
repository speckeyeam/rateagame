//NOTE, THERE IS NO WAY TO LIMIT HOW MANY AWARDS ARE LOADED IN! THERE IS ALSO NO WAY TO GET TTHE MOST RARE AWARDS FIRST BUT THIS ISNT THAT IMPORTANT
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const loadAwards = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token } = await requestData;

  console.log(requestData);
  if (userId && token) {
    let player: any = await playerCheck(userId, token);
    if (player) {
      //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc

      const awards = await prisma.awardInventory.groupBy({
        by: ["awardId"],
        where: {
          userId: userId.toString(),
        },
        _count: {
          awardId: true, // Count occurrences of each awardId
        },
      });

      console.log(awards);
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
