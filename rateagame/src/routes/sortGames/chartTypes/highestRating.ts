import { Context } from "hono";
import { PrismaClient, Prisma } from "@prisma/client";

import { playerCheck } from "../../helpers/playerCheck";
import { gameCheck } from "../../helpers/gameCheck";

const prisma = new PrismaClient();

type Cursor = {
  pctPositive: number;
  totalReviews: number;
  gameId: string;
};

function buildCursor(row: any): string {
  const cur: Cursor = {
    pctPositive: Number(row.pctPositive),
    totalReviews: Number(row.totalReviews),
    gameId: row.gameId,
  };
  return JSON.stringify(cur);
}

function cursorPredicate(cur?: string) {
  if (!cur) return prisma.$queryRaw < ``; // first page
  const { pctPositive, totalReviews, gameId } = JSON.parse(cur) as Cursor;

  return (
    prisma.$queryRaw <
    `
    AND (
         pctPositive  < ${pctPositive}
      OR (pctPositive = ${pctPositive} AND totalReviews < ${totalReviews})
      OR (pctPositive = ${pctPositive} AND totalReviews = ${totalReviews}
                                 AND g.gameId < ${gameId})
    )`
  );
}

// main handler ---------------------------------------------------------
export const getHighestRating = async (c: Context) => {
  const prisma = new PrismaClient();
  const body = await c.req.json().catch(() => ({}));

  const {
    userId,
    take = 50,
    cursor = null,
    minReviews = 20,
    minVisits = 0,
    sinceDays = 7,
    costsRobux = null, // true  ➜ Price > 0
    // false ➜ Price IS NULL OR 0
    // null  ➜ ignore
  } = body;

  if (!userId) return c.json({ error: "userId required" }, 400);

  const startDate = new Date(Date.now() - sinceDays * 86_400_000); // ms/day
  const cursorClause = cursorPredicate(cursor);

  const rows = await prisma.$queryRaw<
    Array<{
      gameId: string;
      Name: string | null;
      visits: number | null;
      Price: number | null;
      totalReviews: number;
      positiveReviews: number;
      pctPositive: number;
    }>
  >`
    WITH ranked AS (
      SELECT
        g.gameId,
        g.Name,
        g.visits,
        g.Price,
        COUNT(r.reviewId)                                         AS totalReviews,
        SUM(CASE WHEN r.recommends THEN 1 ELSE 0 END)             AS positiveReviews,
        SUM(CASE WHEN r.recommends THEN 1 ELSE 0 END) / COUNT(*)  AS pctPositive
      FROM game  g
      JOIN review r ON r.gameId = g.gameId
      WHERE
            r.deleted = FALSE
        AND r.time   >= ${startDate}
        AND COALESCE(g.visits, 0) >= ${minVisits}
        AND (r.gamePassId IS NULL AND r.gameId IS NOT NULL)
        ${
          costsRobux === true
            ? prisma.$queryRaw`AND g.Price > 0`
            : costsRobux === false
            ? prisma.$queryRaw`AND (g.Price = 0 OR g.Price IS NULL)`
            : prisma.$queryRaw``
        }
      GROUP BY g.gameId
      HAVING COUNT(*) >= ${minReviews}
    )
    SELECT *
    FROM ranked g
    WHERE 1 = 1
    ${prisma.$queryRaw(cursorClause)}
    ORDER BY pctPositive DESC, totalReviews DESC, g.gameId DESC
    LIMIT ${take};
  `;
  if (!rows.length) return c.json({ games: [], nextCursor: null });

  return c.json({
    games: rows,
    nextCursor: buildCursor(rows[rows.length - 1]),
  });
};
