import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const deleteReview = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { reviewId, userId, token } = requestData;
  console.log(token);
  if (userId && reviewId && token) {
    let player: any = await playerCheck(userId, token);
    console.log(player);
    if (player) {
      const deletedReview = await prisma.review.delete({
        where: {
          userId: String(userId),
          reviewId,
        },
      });

      if (deletedReview) {
        return c.json({ success: true }, 500);
      }
    }
  }
  return c.json({ success: false }, 500);
};
