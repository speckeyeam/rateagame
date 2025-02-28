import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const awardsRecievedReviews = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { userId, date, awardId, cursorReviewId = null } = requestData;

  if (userId && date) {
    const reviews = await prisma.award.findMany({
      where: {
        receivedUserId: userId.toString(),
        awardId: awardId.toString(),
      },
      take: 100,
      cursor: cursorReviewId.toString(),
      skip: cursorReviewId ? 1 : 0, // Skip the cursor itself
      select: {
        review: true,
      },
    });
    if (reviews) {
      return { reviews };
    }
  }

  return null;
};

//basically, this just gives you all the awards that you recieved based on a certain awardID,
//and theres a cursor that youll need to take from the last value in the batch of reviews if you recieved more than 100 awards of a certain id.
