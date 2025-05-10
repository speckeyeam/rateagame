import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { apikeycheck } from "../helpers/apikeycheck";

import { awardsGiven } from "./chartTypes/awardsGiven";
import { awardsRecieved } from "./chartTypes/awardsRecieved";

const prisma = new PrismaClient();

export const getAwardsInfo = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId } = await requestData;

  console.log(requestData);
  if (userId) {
    let player: any = await apikeycheck(c);
    if (player) {
      const given = await awardsGiven(c);
      const recieved = await awardsRecieved(c);

      //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc
      return c.json(
        {
          success: true,
          given,
          recieved,
        },
        200
      );
    }
  }
  return c.json({ success: false }, 500);
};
