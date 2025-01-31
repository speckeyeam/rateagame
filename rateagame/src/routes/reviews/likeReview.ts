import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const likeReview = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    reviewId,
    gameId,
    userId,
    gamePass, // Default to false if not provided
    token,
    like,
  } = requestData;

  console.log(token);
  if (gameId && userId && token && reviewId) {
    let player: any = await playerCheck(userId, token);
    if (player) {
      console.log(requestData);

      const data: any = {
        userId: String(userId),
        gameId: String(gameId),
        reviewId: String(reviewId),
      };
      if (gamePass) {
        data.gamePassId = String(gameId);
      } else {
        data.gameId = String(gameId);
      }

      const review = await prisma.review.findFirst({
        where: data,
      });
      if (review) {
        data.id = String(reviewId) + "." + String(userId);
        //review exists
        if (like) {
          const newlike = await prisma.like.upsert({
            where: data,
            update: {},
            create: data,
          });
        } else {
          const deletedLike = await prisma.like.delete({
            where: data,
          });
        }
        return c.json({ success: true }, 200);
      }
    }
  }
  return c.json({ success: false }, 500);
};
