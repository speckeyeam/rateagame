//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const getSavedGames = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    userId,
    gamePass = false, //maybe have an option to save gamepasses as well? include a way to view those?
    token,
    date,
  } = requestData;

  console.log(token);
  if (userId && token && date) {
    console.log("went through");
    let player: any = await playerCheck(c);
    if (player) {
      console.log(player);

      console.log(date);
      const data: any = {
        time: {
          lt: new Date(date * 1000),
        },
        userId: String(userId),
      };
      // if (gamePass) {
      //   data.gameId = null;
      // } else {
      //   data.gamePassId = null; //i think this will only get the saved games that arent game passes, will have to test this out later and make it work for gamepasses too instead
      // }
      const savedGames = await prisma.saved.findMany({
        take: 100,
        where: data,
        orderBy: {
          time: "desc",
        },
      });
      console.log(savedGames);
      if (savedGames) {
        return c.json({ success: true, games: savedGames }, 200);
      }
    }
  }
  return c.json({ success: false }, 500);
};
