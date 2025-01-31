import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const deleteReview = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { reviewId, userId, token, gameId } = requestData;
  console.log(token);
  if (userId && reviewId && token && gameId) {
    let player: any = await playerCheck(userId, token);
    console.log(player);
    if (player) {
      const deletedReview = await prisma.review.update({
        where: {
          userId: String(userId),
          reviewId,
        },
        data: { deleted: true },
      });

      if (deletedReview) {
        console.log(deletedReview);
        return c.json({ success: true }, 200);
      }
    }
  }
  return c.json({ success: false }, 500);
};
