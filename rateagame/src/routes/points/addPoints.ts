import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const addPoints = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent
  console.log("test");
  const { userId, token, coins } = requestData;

  if (userId && token && coins) {
    console.log("test2");

    let player: any = await playerCheck(c);
    if (player && coins < 5001) {
      console.log("test3");

      const updatedUser = await prisma.user.update({
        where: { userId: userId.toString() },
        data: {
          coins: {
            increment: coins, // Increase coins by 50
          },
        },
      });
      if (updatedUser) {
        console.log("test4");

        return c.json({ success: true, points: updatedUser.coins }, 200);
      }
    }
  }
  return c.json({ success: false }, 500);
};
