import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { apikeycheck } from "../helpers/apikeycheck";

const prisma = new PrismaClient();

export async function getLeaderboard(c: Context) {
  console.log("went through but it didnt work");
  let apicheck = await apikeycheck(c);
  if (apicheck) {
    console.log("didnt go through");

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

    const usersWithMostLikes = await prisma.like.groupBy({
      by: ["recievedUserId"],
      where: {
        recievedUserId: { not: null }, // ensure we only group likes that have a received user
        review: {
          deleted: false,
        },
      },
      _count: {
        id: true, // count the likes per group
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 100,
    });
    if (topReviewers && usersWithMostLikes) {
      return c.json({ success: true, topReviewers, usersWithMostLikes }, 500);
    }
  }
  return c.json({ success: false }, 500);
}
