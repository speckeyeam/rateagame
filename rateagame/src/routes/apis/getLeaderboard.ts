import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { apikeycheck } from "../helpers/apikeycheck";

const prisma = new PrismaClient();

export async function getLeaderboard(c: Context) {
  let apicheck = await apikeycheck(c);
  if (apicheck) {
    const topReviewers = await prisma.review.groupBy({
      by: ["userId"],
      _count: {
        reviewId: true,
      },
      orderBy: {
        _count: {
          reviewId: "desc",
        },
      },
      where: {
        deleted: false,
      },
      take: 100,
    });

    const usersWithMostLikes = await prisma.review.groupBy({
      by: ["userId"],
      _count: {
        likes: true,
      },
      orderBy: {
        _count: {
          likes: "desc",
        },
      },
      // Optionally, you can filter out deleted reviews:
      where: {
        deleted: false,
      },
      take: 100,
    });
    if (topReviewers && usersWithMostLikes) {
      return c.json({ success: true, topReviewers, usersWithMostLikes }, 500);
    }
  }
  return c.json({ success: false }, 500);
}
