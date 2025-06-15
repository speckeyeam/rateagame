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
    let player: any = await playerCheck(c);
    if (player) {
      console.log(requestData);

      const data: any = {
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
        if (review.userId != String(userId)) {
          data.id = String(reviewId) + "." + String(userId);
          data.userId = userId.toString();
          data.recievedUserId = review.userId;
          const likeExists = await prisma.like.findFirst({
            where: data,
          });
          //like doesnt exist
          if (!likeExists) {
            console.log("like doesnt exist");
            if (review.userId && review.userId != userId.toString()) {
              const givePoints = await prisma.user.update({
                where: { userId: review.userId },
                data: {
                  coins: {
                    increment: 1, // Increase coins by 500
                  },
                },
              });
              console.log("gave points");
            }
          }
          const newlike = await prisma.like.upsert({
            where: data,
            update: { value: like },
            create: data,
          });
          return c.json({ success: true }, 200);
        }
      }
    }
  }
  return c.json({ success: false }, 500);
};
