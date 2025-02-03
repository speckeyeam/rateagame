//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const getPercentage = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    gameId,
    userId,
    gamePass, // Default to false if not provided
    token,
    date,
  } = requestData;

  console.log(token);
  if (gameId && userId && token && date) {
    let player: any = await playerCheck(userId, token);
    if (player) {
      console.log(player);

      //   let game: any = await gameCheck(gameId, gamePass);

      const data: any = {};
      if (gamePass) {
        data.gamePassId = String(gameId);
      } else {
        data.gameId = String(gameId);
      }

      const reviewStats = await prisma.review.aggregate({
        where: data,
        _count: {
          _all: true, // Total number of reviews
          recommends: true, // Counts the number of true values in the recommends column
        },
      });

      if (reviewStats) {
        return c.json({ success: true, stats: reviewStats }, 200);
      }
    }
  }
  return c.json({ success: false }, 500);
};
