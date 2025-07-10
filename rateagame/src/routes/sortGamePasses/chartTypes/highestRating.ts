import { Context } from "hono";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type Cursor = { pctPositive: number; totalReviews: number; gamePassId: string };

// ---------- helpers -------------------------------------------------------

const cursorPredicate = (cur?: string): Prisma.sql => {
  if (!cur) return Prisma.sql``; // first page → no filter
  const { pctPositive, totalReviews, gamePassId } = JSON.parse(cur) as Cursor;

  return Prisma.sql`
    AND (
         pctPositive  < ${pctPositive}
      OR (pctPositive = ${pctPositive} AND totalReviews < ${totalReviews})
      OR (pctPositive = ${pctPositive} AND totalReviews = ${totalReviews}
                                   AND g.gamePassId < ${gamePassId})
    )
  `;
};

const buildCursor = (row: any): string =>
  JSON.stringify({
    pctPositive: Number(row.pctPositive),
    totalReviews: Number(row.totalReviews),
    gamePassId: row.gamePassId,
  } as Cursor);

// ---------- main handler --------------------------------------------------

export const getHighestRating = async (c: Context) => {
  const body = await c.req.json().catch(() => ({}));

  const {
    userId,
    take = 100,
    ascending = false,
    cursor = null,
    reviews = 1,
    visits = 0,
    date = 7,
    costsRobux = null, // true ➜ Price > 0 ; false ➜ free ; null ➜ ignore
  } = body;

  if (!userId) return c.json({ error: "userId required" }, 400);

  const dir = ascending ? Prisma.sql`ASC` : Prisma.sql`DESC`; // ⇦ choose once
  const orderSql = Prisma.sql`
ORDER BY pctPositive ${dir},
         totalReviews ${dir},
         g.gamePassId     ${dir}
`;

  const startDate =
    date > 0 ? new Date(Date.now() - date * 24 * 60 * 60 * 1000) : null;
  const cursorClause = cursorPredicate(cursor);
  const costsRobuxSql: Prisma.sql =
    costsRobux === true
      ? Prisma.sql`AND g.Price > 0`
      : costsRobux === false
      ? Prisma.sql`AND (g.Price = 0 OR g.Price IS NULL)`
      : Prisma.sql``; // no extra filter

  const rows = await prisma.$queryRaw<
    Array<{
      gamePassId: string;
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
        g.gamePassId,
        g.Name,
        g.visits,
        g.Price,
        COUNT(r.reviewId)                               AS totalReviews,
        SUM(r.recommends)                               AS positiveReviews,
        SUM(r.recommends) / COUNT(*)                    AS pctPositive
      FROM game  g
      JOIN review r ON r.gamePassId = g.gamePassId
      WHERE r.deleted   = FALSE
        AND r.time      >= ${startDate}
        AND COALESCE(g.visits, 0) >= ${visits}
        AND (r.gamePassId IS NOT NULL AND r.gamePassId IS NULL)
        ${costsRobuxSql}
      GROUP BY g.gamePassId
      HAVING COUNT(*) >= ${reviews}
      ${orderSql}
    )
    SELECT *
    FROM ranked g
    WHERE 1 = 1
      ${cursorClause}
    LIMIT 100
  `);

  const games = rows.map((r: any) => ({
    ...r,
    totalReviews: Number(r.totalReviews), // ← or String()
    positiveReviews: Number(r.positiveReviews),
    pctPositive: Number(r.pctPositive), // Decimal → number
  }));
  return {
    games: games,
    nextCursor: buildCursor(games[games.length - 1]),
  };
};
