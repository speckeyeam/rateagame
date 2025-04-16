//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const mostLiked = async (c: Context, days: number) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId } = requestData;

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - days);

  // Step 1: Group likes by reviewId and count them
  const likeCounts = await prisma.like.groupBy({
    by: ["reviewId"],
    where: {
      time: {
        gte: oneDayAgo,
      },
      value: true,
    },
    _count: {
      reviewId: true,
    },
    orderBy: {
      _count: {
        reviewId: "desc",
      },
    },
    take: 10,
  });

  const reviewIds = likeCounts.map((like) => like.reviewId);

  // Step 2: Fetch review data for the top reviewIds
  const reviews = await prisma.review.findMany({
    where: {
      reviewId: {
        in: reviewIds,
      },
    },
    include: {
      user: true,
      game: true,
      // likes: {
      //   where: {
      //     time: {
      //       gte: oneDayAgo,
      //     },
      //     value: true,
      //   },
      // },

      _count: {
        select: { likes: { where: { value: true } } }, // Include the number of likes for each review
      },
      likes: {
        where: { userId: userId.toString(), value: true }, // Check if the user has liked the review
        select: { userId: true }, // Select userId to determine if a like exists
      },
    },
  });

  // Step 3: Merge like counts into the reviews
  const reviewMap = new Map(reviews.map((r) => [r.reviewId, r]));
  const result = likeCounts.map((like) => ({
    ...reviewMap.get(like.reviewId),
    likeCount: like._count.reviewId,
  }));

  return { reviews: result };
};
