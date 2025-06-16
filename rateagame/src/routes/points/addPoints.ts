import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";

const prisma = new PrismaClient();

export const addPoints = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token } = requestData;

  console.log(token);
  if (userId && token) {
    let player: any = await playerCheck(c);
    if (player) {
      const updatedUser = await prisma.user.update({
        where: { userId: userId.toString() },
        data: {
          coins: {
            increment: 50, // Increase coins by 50
          },
        },
      });
      if (updatedUser) {
        return c.json({ success: true, points: updatedUser.coins }, 200);
      }
    }
  }
  return c.json({ success: false }, 500);
};
