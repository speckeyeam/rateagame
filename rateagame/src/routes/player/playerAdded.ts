import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { getInventory } from "../helpers/awardCheck";

import { awardCheck } from "../helpers/awardCheck";

import md5 from "md5";
import { Buffer } from "buffer"; // Bun provides this natively.
//test
async function generateContentMD5(content: string) {
  const hash = md5(content);

  // Convert the hash to a Base64 string
  const contentMD5 = Buffer.from(hash, "hex").toString("base64");

  return contentMD5;
}

export const playerAdded = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null);

  let userId = String(requestData.userId);

  const authHeader = c.req.header("Authorization") ?? "";

  // Quickly check if it starts with "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const key = authHeader.slice("Bearer ".length);
  if (userId && key == process.env.MY_API_KEY) {
    //just check if the user already exists and if it does return the token otherwise create a new user

    const startingInventory = await getInventory();
    const awardsToInsert = (
      await Promise.all(
        Object.entries(startingInventory).map(
          async ([awardId, { quantity }]) => {
            return Array.from({ length: quantity }, () => ({
              awardId,
            }));
          }
        )
      )
    ).flat(); // Flatten the array after promises resolve

    console.log(awardsToInsert);
    //wonder if this award stuff will work :) will have to reset everything tho
    const newUser = await prisma.user.upsert({
      where: { userId },
      update: {}, // No update fields (or you can add fields to update)
      create: {
        userId,
        dateJoined: new Date(),
        coins: 0,
        awardInventory: {
          create: awardsToInsert,
        },
      },
    });
    if (newUser) {
      return c.json({ success: true, token: newUser.token }, 200);
    } else {
      return c.json({ success: false }, 200);
    }
  }

  return c.json({ success: false }, 500);
};
