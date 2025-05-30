import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

import { playerCheck } from "../helpers/playerCheck";
import { gameCheck } from "../helpers/gameCheck";
import { stringBufferToString } from "hono/utils/html";

const prisma = new PrismaClient();

export const GetParent = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { gamePassId } = requestData;

  if (gamePassId) {
    const gamePass = await prisma.gamePass.findFirst({
      where: { gamePassId: String(gamePassId) },
    });

    if (gamePass) {
      return c.json({ success: true, gamePass }, 200);
    }
  }
  return c.json({ success: false }, 500);
};
