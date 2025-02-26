import { PrismaClient } from "@prisma/client";
import { env } from "bun";
import { Context } from "hono";

const prisma = new PrismaClient();

export const apikeycheck = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const authHeader = c.req.header("Authorization") ?? "";

  // Quickly check if it starts with "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const key = authHeader.slice("Bearer ".length);

  if (key == process.env.MY_API_KEY) {
    return true;
  }
  return null;
};

//SHOULD DEF CHECK IF THE TOKEN EXISTS IN THE ROBLOX DATASTORE HERE!
//prob need a way to deal with session tokens and maybe use datastores for that
