import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const submit = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  let gameId = requestData.gameId;
  let date = requestData.date;
  let text = requestData.text;
  let recommends = requestData.recommends;
  let userId = requestData.userId;
  let reviewId = requestData.reviewId;
  let gamePass = requestData.gamePass; //check if this works properly, it might be a string and not a boolean
  //make sure that when looping out all user generated content u are using roblox's filter system
  console.log(gameId);
  console.log(date);
  console.log(text);
  console.log(recommends);
  console.log(userId);
  console.log(reviewId);
  console.log(gamePass);

  if (gameId & date & text & recommends & userId & gamePass) {
    await playerCheck(userId);
    await gameCheck(gameId, gamePass);
    if (text.length < 2001 && date.length < 2001) {
      const newreviewdata = await prisma.reviewData.create({
        data: {
          reviewId,
          time: date,
          text,
          gameId,
          userId,
          recommends,
        },
      });
      const newreview = await prisma.review.create({
        data: {
          reviewId,
          time: date,
          userId,
          gameId,
          recommends,
          gamePass: false,
        },
      });
      console.log(newreview);
      if (newreview && newreviewdata) {
        return c.json({ success: true }, 500);
      } else {
        return c.json({ success: false }, 500);
      }
    }
  } else {
    return c.json({ success: false }, 500);
  }
};
