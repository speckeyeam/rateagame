//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

const prisma = new PrismaClient();

export const getOtherReviews = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    gameId,
    userId,
    gamePass, // Default to false if not provided
    token,
    date,
    option,
  } = requestData;

  let orderBy: any = {};
  switch (option) {
    case "Most Liked":
      orderBy = {
        likes: { _count: "desc" },
      };
      break;
    case "Newest":
      orderBy = { createdAt: "desc" };
      break;
    case "Oldesr":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" }; // fallback
  }
  if (gameId && userId && token && date) {
    let player: any = await playerCheck(c);
    if (player) {
      console.log(player);

      let game: any = await gameCheck(gameId, gamePass);
      console.log(date);
      const data: any = {
        time: {
          lt: new Date(date * 1000),
        },
        deleted: false,
      };
      if (gamePass) {
        data.gamePassId = String(gameId);
      } else {
        data.gameId = String(gameId);
      }

      const reviews = await prisma.review.findMany({
        take: 100,
        where: data,
        orderBy,
        include: {
          _count: {
            select: { likes: { where: { value: true } } }, // Include the number of likes for each review
          },
          likes: {
            where: { userId: userId.toString(), value: true }, // Check if the user has liked the review
            select: { userId: true }, // Select userId to determine if a like exists
          },
        },
      });
      console.log(reviews);
      if (reviews) {
        return c.json({ success: true, reviews }, 200);
      }
    }
  }
  return c.json({ success: false }, 500);
};
