import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";

import { awardsGiven } from "./chartTypes/awardsGiven";
import { awardsRecieved } from "./chartTypes/awardsRecieved";

const prisma = new PrismaClient();

export const getAwardsInfo = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token, call } = await requestData;

  console.log(requestData);
  if (userId && token && call) {
    let player: any = await playerCheck(c);
    if (player) {
      const recieved = await awardsRecieved(c);
      const given = await awardsGiven(c);

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
