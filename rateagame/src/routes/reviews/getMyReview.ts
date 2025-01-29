import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const getMyReview = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    gameId,
    userId,
    reviewId,
    gamePass = false, // Default to false if not provided
    token,
  } = requestData;

  console.log(token);
  if (gameId && userId && reviewId && token) {
    let player: any = await playerCheck(userId, token);
    console.log(player);
    if (player) {
      let game: any = await gameCheck(gameId, gamePass);

      const myReview = await prisma.review.findFirst({
        where: {
          userId: String(userId),
          gameId: String(userId),
          reviewId,
          gamePass,
        },
      });

      if (myReview) {
        return c.json({ success: true, review: myReview }, 500);
      } else {
        return c.json({ success: false }, 500);
      }
    } else {
      return c.json({ success: false }, 500);
    }
  }
};
