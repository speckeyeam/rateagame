import { Context } from "hono";
import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../../helpers/playerCheck";
import { gameCheck } from "../../helpers/gameCheck";

const prisma = new PrismaClient();

// Gets the most trending games in the past week (or a configurable number of days)
// based on the most reviews. (For Roblox: you could paginate reviews by time.)
export const getTopGamePasses = async (c: Context) => {
  console.log("huh");
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, take, cursor = null } = requestData;

  const gamePass = true;
  if (userId && take) {
    const data: any = {
      by: ["gamePassId", "assetId"],
      take,
      skip: cursor ? 1 : 0, // Skip the cursor item itself
      cursor: cursor
        ? { [gamePass ? "gamePassId" : "gameId"]: cursor }
        : undefined,
      // If days > 0, filter reviews within that time range.
      where: {
        deleted: false,
      },
      _count: {
        [gamePass ? "gamePassId" : "gameId"]: true, // Count based on grouping field
      },
      orderBy: {
        _count: {
          [gamePass ? "gamePassId" : "gameId"]: "desc", // Sort by the count of the grouping field
        },
      },
    };

    const recentlyReviewed = await prisma.review.groupBy(data);

    if (recentlyReviewed) {
      return {
        games: recentlyReviewed,
        nextCursor:
          recentlyReviewed[recentlyReviewed.length - 1][
            gamePass ? "gamePassId" : "gameId"
          ],
      };
    }
  }

  return null;
};
