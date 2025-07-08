//honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
export const getLeastPopular = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const {
    take = 45,
    ascending = false,
    costRobux = false,
    visits = 0,
    reviews = 0,
    cursor = null,
  } = requestData;

  const games = await prisma.game.findMany({
    where: {
      forSale: costRobux, // true / false  ➜ matches your UI filter
      visits: { gt: visits - 1 }, // minimum-visits screen
    },

    // Cursor paging
    ...(cursor && { cursor: { gameId: cursor }, skip: 1 }),
    take,

    // Sort by a scalar on `game`
    orderBy: { visits: ascending ? "asc" : "desc" },

    /**
     * Everything we want to show:
     *  • raw game fields
     *  • review aggregates (total, positive, avgRating)
     */
    select: {
      gameId: true,
      Name: true,
      visits: true,

      _count: {
        select: {
          reviews: {
            where: {
              deleted: false,
              gamePassId: null,
            },
          },

          reviewsPos: {
            where: {
              deleted: false,
              gamePassId: null,
              recommends: true,
            },
          },
        },
      },
      reviews: {
        where: { deleted: false, gamePassId: null },
        _avg: { rating: true },
        take: 0,
      },
    },
  });
  return { games, nextCursor: games[games.length - 1].gameId };
};
