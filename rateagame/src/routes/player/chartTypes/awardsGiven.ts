//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const awardsGiven = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId } = requestData;

  if (userId) {
    const awards = await prisma.award.groupBy({
      by: ["awardId"],
      where: {
        givenUserId: userId.toString(),
      },
      _count: {
        _all: true,
      },
    });
    if (awards) {
      return { awards };
    }
  }

  return null;
};
