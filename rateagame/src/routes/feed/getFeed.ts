import { Context } from "hono";
import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const getFeed = async (c: Context) => {
  // Safely parse JSON
  const requestData = await c.req.json().catch(() => null);

  const { userId, token, cursor = null } = requestData || {};

  console.log(requestData);
  if (userId && token) {
    // Check if user is valid
    const player = await playerCheck(c);
    if (player) {
      // Query config for unviewed reviews
      const queryConfig: any = {
        where: {
          deleted: false,
          userId: { not: userId.toString() },
          viewed: {
            none: {
              userId: userId.toString(),
            },
          },
        },
        take: 5,
      };

      // If a cursor is provided, skip that review and continue
      if (cursor) {
        queryConfig.skip = 1;
        queryConfig.cursor = { reviewId: cursor };
      }

      // Fetch unviewed reviews
      const unviewedReviews = await prisma.review.findMany(queryConfig);

      // Mark them as viewed
      if (unviewedReviews.length > 0) {
        await prisma.viewed.createMany({
          data: unviewedReviews.map((review) => ({
            userId: userId.toString(),
            reviewId: review.reviewId,
          })),
          // If you're on a Prisma version that supports skipDuplicates,
          // you can prevent duplicate records insertion:
          skipDuplicates: true,
        });
      }

      // Return the reviews and a nextCursor
      return c.json(
        {
          success: true,
          reviews: unviewedReviews,
          nextCursor:
            unviewedReviews.length > 0
              ? unviewedReviews[unviewedReviews.length - 1].reviewId
              : null,
        },
        200
      );
    }
  }

  return c.json({ success: false }, 500);
};
