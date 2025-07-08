import { Context } from "hono";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type Cursor = { pctPositive: number; totalReviews: number; gameId: string };

// ---------- helpers -------------------------------------------------------

const cursorPredicate = (cur?: string): Prisma.sql => {
  if (!cur) return Prisma.sql``; // first page → no filter
  const { pctPositive, totalReviews, gameId } = JSON.parse(cur) as Cursor;

  return Prisma.sql`
    AND (
         pctPositive  < ${pctPositive}
      OR (pctPositive = ${pctPositive} AND totalReviews < ${totalReviews})
      OR (pctPositive = ${pctPositive} AND totalReviews = ${totalReviews}
                                   AND g.gameId < ${gameId})
    )
  `;
};

const buildCursor = (row: any): string =>
  JSON.stringify({
    pctPositive: Number(row.pctPositive),
    totalReviews: Number(row.totalReviews),
    gameId: row.gameId,
  } as Cursor);

// ---------- main handler --------------------------------------------------

export const getHighestRating = async (c: Context) => {
  const body = await c.req.json().catch(() => ({}));

  const {
    userId,
    take = 50,
    cursor = null,
    minReviews = 1,
    minVisits = 0,
    sinceDays = 7,
    costsRobux = null, // true ➜ Price > 0 ; false ➜ free ; null ➜ ignore
  } = body;

  if (!userId) return c.json({ error: "userId required" }, 400);

  const startDate = new Date(Date.now() - sinceDays * 86_400_000);
  const cursorClause = cursorPredicate(cursor);
  const costsRobuxSql: Prisma.sql =
    costsRobux === true
      ? Prisma.sql`AND g.Price > 0`
      : costsRobux === false
      ? Prisma.sql`AND (g.Price = 0 OR g.Price IS NULL)`
      : Prisma.sql``; // no extra filter

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
  >(Prisma.sql`
    WITH ranked AS (
      SELECT
        g.gameId,
        g.Name,
        g.visits,
        g.Price,
        COUNT(r.reviewId)                               AS totalReviews,
        SUM(r.recommends)                               AS positiveReviews,
        SUM(r.recommends) / COUNT(*)                    AS pctPositive
      FROM game  g
      JOIN review r ON r.gameId = g.gameId
      WHERE r.deleted   = FALSE
        AND r.time      >= ${startDate}
        AND COALESCE(g.visits, 0) >= ${minVisits}
        AND (r.gamePassId IS NULL AND r.gameId IS NOT NULL)
        ${costsRobuxSql}
      GROUP BY g.gameId
      HAVING COUNT(*) >= ${minReviews}
    )
    SELECT *
    FROM ranked g
    WHERE 1 = 1
      ${cursorClause}
    ORDER BY pctPositive DESC,
             totalReviews DESC,
             g.gameId     DESC
    LIMIT ${Prisma.sql`${take}`}
  `);

  console.log(rows);
  if (!rows.length) return c.json({ games: [], nextCursor: null });

  return c.json({
    games: rows,
    nextCursor: buildCursor(rows[rows.length - 1]),
  });
};
