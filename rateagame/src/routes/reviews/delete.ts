import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const deleteReview = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    gameId,
    reviewId,
    userId, // Default to false if not provided
    gamePass = false,
    token,
  } = requestData;
  console.log(token);
  if (gameId && userId && reviewId && token) {
    let player: any = await playerCheck(userId, token);
    console.log(player);
    if (player) {
      const deletedReview = await prisma.review.delete({
        where: {
          userId: String(userId),
          gameId: String(userId),
          reviewId,
          gamePass,
        },
      });

      if (deletedReview) {
        return c.json({ success: true }, 500);
      } else {
        return c.json({ success: false }, 500);
      }
    } else {
      return c.json({ success: false }, 500);
    }
  }
};
