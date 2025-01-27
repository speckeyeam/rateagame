import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";

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
  if (gameId & date & text & recommends & userId) {
    await playerCheck;
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

      if (newreview && newreviewdata) {
        return c.json({ success: true }, 500);
      } else {
        return c.json({ success: false }, 500);
      }
    }
  }
};
