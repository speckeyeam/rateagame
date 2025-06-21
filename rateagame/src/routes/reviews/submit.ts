import { Context } from "hono";

import { Prisma, PrismaClient, reviewData } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";
import { NewLineKind } from "typescript";

const prisma = new PrismaClient();

export const submit = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    gameId,
    time,
    text,
    recommends,
    userId,
    reviewId,
    gamePass, // Default to false if not provided
    token,
    parentId = null,
  } = requestData;

  console.log(token);
  if (
    gameId &&
    time &&
    text &&
    typeof recommends == "boolean" &&
    userId &&
    reviewId &&
    token
  ) {
    let player: any = await playerCheck(c);
    console.log(player);
    if (player) {
      let game: any = await gameCheck(gameId, gamePass, parentId);

      if (text.length < 2001 && game) {
        const data: any = {
          reviewId: String(reviewId),
          time: new Date(time * 1000),
          text,
          date: String(time),
          userId: String(userId),
          recommends,
          rating: recommends ? 1 : -1,
          assetId: String(gameId),
          [gamePass ? "gamePassId" : "gameId"]: String(gameId),
        };

        const data2: any = {
          userId: userId.toString(),
          deleted: false,
        };
        if (gamePass) {
          data2.gamePassId = String(gameId);
        } else {
          data2.gameId = String(gameId);
        }
        const checkReviews = await prisma.review.findMany({
          where: data2,
        });
        if (checkReviews.length == 0) {
          const newreview = await prisma.review.create({
            data,
          });
          console.log(newreview);

          const userReviewCount = await prisma.review.count({
            where: { userId: userId.toString(), deleted: false },
          });

          if (newreview) {
            return c.json(
              { success: true, review: newreview, userReviewCount },
              200
            );
          }
        }
      }
    } else {
      return c.json({ success: false }, 500);
    }
  }
};
