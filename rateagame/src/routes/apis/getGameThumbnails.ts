//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const getGameThumbnails = async (c: Context) => {
  //maybe set this to check if the right auth key was sent so that not anyone could use this?
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { universeId, token, userId } = requestData;

  const gamesUrl = `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&countPerUniverse=20&defaults=true&size=768x432&format=Png&isCircular=false`;

  if (token && universeId && userId) {
    //i prob dont need authorization for this rn
  }
  try {
    const response = await fetch(gamesUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    console.log(data);
    if (data) {
      return c.json({ success: true, data }, 200);
    }
  } catch (error) {
    console.error("Error fetching game thumbnails:", error);
    return c.json({ success: false }, 500);
  }
};
