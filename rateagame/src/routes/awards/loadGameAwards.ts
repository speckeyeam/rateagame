//NOTE, THERE IS NO WAY TO LIMIT HOW MANY AWARDS ARE LOADED IN! THERE IS ALSO NO WAY TO GET TTHE MOST RARE AWARDS FIRST BUT THIS ISNT THAT IMPORTANT
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loadReviewAwards = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { gameId, gamePass } = await requestData;
  if (gameId) {
    const authHeader = c.req.header("Authorization") ?? "";

    // Quickly check if it starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const key = authHeader.slice("Bearer ".length);

    if (key == process.env.MY_API_KEY) {
      //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc

      const awards = await prisma.award.groupBy({
        by: ["awardId"], // Group by awardId, ensuring it appears in results
        where: {
          [gamePass ? "gamePassId" : "gameId"]: gameId.toString(),
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
