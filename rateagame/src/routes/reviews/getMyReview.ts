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
    gamePass, // Default to false if not provided
    token,
    otherPlayerId = null,
  } = requestData;

  console.log(token);
  if (gameId && userId && token) {
    let player: any = await playerCheck(c);
    if (player) {
      if (otherPlayerId) {
      } else {
        console.log(player);

        let game: any = await gameCheck(gameId, gamePass);

        const data: any = {
          userId: String(userId),
          deleted: false,
        };
        if (gamePass) {
          data.gamePassId = String(gameId);
        } else {
          data.gameId = String(gameId);
        }

        const myReview = await prisma.review.findFirst({
          where: data,
        });
        console.log(myReview);
        if (myReview) {
          return c.json({ success: true, review: myReview }, 200);
        }
      }
    }
  }
  return c.json({ success: false }, 500);
};
