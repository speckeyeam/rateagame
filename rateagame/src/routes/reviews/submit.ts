import { Context } from "hono";

import { Prisma, PrismaClient, reviewData } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

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
  } = requestData;

  //   let gameId: string = requestData.gameId.toString();
  //   let date = new Date(requestData.date * 1000);
  //   let text = requestData.text;
  //   let recommends = requestData.recommends;
  //   let userId: string = requestData.userId.toString();
  //   let reviewId = requestData.reviewId;
  //   let gamePass = requestData.gamePass || false; //check if this works properly, it might be a string and not a boolean
  //make sure that when looping out all user generated content u are using roblox's filter system
  console.log(token);
  if (gameId && time && text && recommends && userId && reviewId && token) {
    let player: any = await playerCheck(userId, token);
    console.log(player);
    if (player) {
      let game: any = await gameCheck(gameId, gamePass);

      if (text.length < 2001) {
        const data: any = {
          reviewId: String(reviewId),
          time: new Date(time * 1000),
          userId: String(userId),
          text,
          recommends,
          date: String(time),
        };
        if (gamePass) {
          data.gamePassId = String(gameId);
        } else {
          data.gameId = String(gameId);
        }

        const newreviewdata = await prisma.reviewData.create({
          data,
        });

        const data2: any = {
          reviewId: String(reviewId),
          time: new Date(time * 1000),
          userId: String(userId),
          recommends,
        };
        if (gamePass) {
          data2.gamePassId = String(gameId);
        } else {
          data2.gameId = String(gameId);
        }

        const newreview = await prisma.review.create({
          data: data2,
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
  }
};
