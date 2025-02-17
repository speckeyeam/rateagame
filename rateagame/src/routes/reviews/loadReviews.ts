import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { gameCheck } from "../helpers/gameCheck";

export const loadReviews = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  let dataStore1;
  let dataStore2: String;
  let gameId;

  if (requestData.gameId) {
    dataStore1 = requestData.gameId + "likes";
    dataStore2 = requestData.gameId + "reviews";
    gameId = requestData.gameId;

    await gameCheck(gameId, false);
  }

  let reviews = await requestData.reviews;

  const game = await prisma.game.findUnique({
    where: {
      gameId: gameId.toString(),
    },
  });
  if (!game) {
    const newgame = await prisma.game.create({
      data: {
        gameId: gameId.toString(),
      },
    });
  }

  for (let i = 0; i < reviews.length; i++) {
    console.log(i);
    let review: any = reviews[i];

    if (!review.review) {
      console.warn(
        `Review at index ${i} is missing the 'review' property. Skipping...`
      );
      continue;
    }
    let reviewId = review.key;
    console.log(review);
    let recommends = review.review?.recommends || false;

    let text = review.review.review;
    let date = review.review.date.toString();
    let dateTime = new Date((date || 0) * 1000);
    let likes = review.value;

    const checkreview = await prisma.review.findUnique({
      where: {
        reviewId: review.key,
      },
    });

    let userId = review.userId.toString();
    const checkuser = await prisma.user.findUnique({
      where: {
        userId: review.userId.toString(),
      },
    });

    if (!checkuser) {
      const newuser = await prisma.user.create({
        data: {
          userId,
          dateJoined: new Date(),
          coins: 150,
        },
      });
    }

    if (!checkreview) {
      console.log("not being created for some rason");
      const newreview = await prisma.review.create({
        data: {
          reviewId,
          time: dateTime,
          userId,
          gameId: String(gameId),
          text,
          date,
          recommends,
          rating: recommends ? 1 : -1,
          assetId: String(gameId),
        },
      });

      for (let k = 0; k < reviews.length; k++) {
        const like = await prisma.like.create({
          data: {
            reviewId,
            gameId: gameId.toString(),
            value: true,
            userId: i + "." + reviewId + "temp",
          },
        });
        //create artifical likes
      }
    } else {
      console.log("review already exist?");
    }
  }

  console.log(requestData);
  return c.json({ success: true }, 200);
};
