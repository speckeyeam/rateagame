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

  if (
    gameId &&
    time &&
    text &&
    typeof recommends == "boolean" &&
    userId &&
    reviewId &&
    token
  ) {
    const t0 = performance.now();

    let player: any = await playerCheck(c);
    console.log("playerCheck:", performance.now() - t0);

    if (player) {
      if (text.length < 2001) {
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
        const t1 = performance.now();

        if ((await prisma.review.count({ where: data2 })) === 0) {
          console.log("dup-count:", performance.now() - t1);

          const t2 = performance.now();

          const newreview = await prisma.review.create({
            data,
          });
          console.log("create:", performance.now() - t2);

          const t3 = performance.now();

          const userReviewCount = await prisma.review.count({
            where: { userId: userId.toString(), deleted: false },
          });
          console.log("count-user:", performance.now() - t3);
          console.log("TOTAL:", performance.now() - t0);

          if (newreview) {
            return c.json(
              { success: true, review: newreview, userReviewCount },
              200
            );
          }
        }
      }
      void gameCheck(gameId, gamePass, parentId).catch((err) =>
        console.error("gameCheck failed:", err)
      );
    }
    return c.json({ success: false }, 500);
  }
};
