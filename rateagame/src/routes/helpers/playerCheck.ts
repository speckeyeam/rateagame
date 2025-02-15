import { PrismaClient } from "@prisma/client";
import { env } from "bun";
import { Context } from "hono";

const prisma = new PrismaClient();

export const playerCheck = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, token } = requestData;

  const authHeader = await c.req.header("Authorization");
  if (!authHeader) {
    // Handle missing header
    return new Response(JSON.stringify({ error: "No Authorization header" }), {
      status: 401,
    });
  }

  // authHeader should be something like "Bearer <token>"
  // If you specifically want to parse out just the token after "Bearer "
  const expectedPrefix = "Bearer ";
  if (!authHeader.startsWith(expectedPrefix)) {
    return new Response(
      JSON.stringify({ error: "Invalid Authorization scheme" }),
      { status: 401 }
    );
  }

  const key = authHeader.slice(expectedPrefix.length);

  if (key == process.env.MY_API_KEY) {
    if (userId.length > 100) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: { userId: String(userId), token },
    });
    if (user) {
      return user;
    }
  }
  return null;
};

//SHOULD DEF CHECK IF THE TOKEN EXISTS IN THE ROBLOX DATASTORE HERE!
//prob need a way to deal with session tokens and maybe use datastores for that
