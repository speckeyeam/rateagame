//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const getTopRated = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    userId,
    gamePass, // Default to false if not provided
    take,
    date,
  } = requestData;

  if (userId && take && date) {
    let formattedDate = new Date(date * 1000);
    const field = gamePass ? "gamePassId" : "gameId";
    const mySqlDateString = formattedDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // Build the raw SQL query. The query filters:
    // - Reviews that aren't deleted.
    // - Reviews that have a non-null value in the chosen field.
    // - Reviews with a "time" greater than or equal to the provided startDate.
    const query = `
    SELECT
      \`${field}\` AS identifier,
      COUNT(*) AS total_reviews,
      SUM(CASE WHEN \`recommends\` = 1 THEN 1 ELSE 0 END) AS positive_reviews,
      -- multiply by 1.0 or CAST(...) to ensure a float division
      (SUM(CASE WHEN \`recommends\` = 1 THEN 1 ELSE 0 END) * 1.0 / COUNT(*)) AS positive_ratio
    FROM \`review\`
    WHERE \`deleted\` = false
      AND \`${field}\` IS NOT NULL
      AND \`time\` >= '${mySqlDateString}'
    GROUP BY \`${field}\`
    ORDER BY positive_ratio DESC
    LIMIT ${take};
  `;
    const topRated = await prisma.$queryRawUnsafe(query);
    console.log(topRated);

    return topRated;
  }

  return null;
};
