import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

import { getNewest } from "./chartTypes/newest";
import { getMostLiked } from "./chartTypes/mostLiked";
import { getLeastPopular } from "./chartTypes/leastPopular";
import { getMostReviewed } from "./chartTypes/getMostReviewed";
import { getHighestRating } from "./chartTypes/highestRating";

const prisma = new PrismaClient();

export const sort = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token, call } = await requestData;

  const functions: any = {
    "Most Liked": getMostLiked, //i think get top rated is already done here
    "Least Popular": getLeastPopular,
    "Newest Games": getNewest,
    "Most Reviewed": getMostReviewed,
    "Highest Rating": getHighestRating,
  };
  console.log(requestData);
  if (userId && call) {
    console.log("test");
    const data = await functions[call](c);
    return c.json(
      {
        success: true,
        games: data?.games,
        nextCursor: data?.nextCursor,
      },
      200
    );
  }
  console.log("fail");

  return c.json({ success: false }, 500);
};
