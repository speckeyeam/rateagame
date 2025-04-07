import { Context } from "hono";
import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const getFeed = async (c: Context) => {
  // Safely parse JSON
  const requestData = await c.req.json().catch(() => null);

  const { userId, cursor = null } = requestData || {};

  console.log(requestData);
  if (userId) {
    // Check if user is valid

    const authHeader = c.req.header("Authorization") ?? "";

    // Quickly check if it starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const key = authHeader.slice("Bearer ".length);

    if (key == process.env.MY_API_KEY) {
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
        orderBy: {
          likes: {
            _count: "desc",
          },
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
      // if (unviewedReviews.length > 0) {
      //   await prisma.viewed.createMany({
      //     data: unviewedReviews.map((review) => ({
      //       userId: userId.toString(),
      //       reviewId: review.reviewId,
      //     })),
      //     // If you're on a Prisma version that supports skipDuplicates,
      //     // you can prevent duplicate records insertion:
      //     skipDuplicates: true,
      //   });
      // }

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
