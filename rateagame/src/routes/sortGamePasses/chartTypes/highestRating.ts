import { Context } from "hono";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type Cursor = {
  pctPositive: number;
  totalReviews: number;
  gamePassId: string;
};

/* ---------------- helpers ---------------- */

const cursorPredicate = (cur?: string): Prisma.Sql => {
  if (!cur) return Prisma.sql``; // first page – no filter
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

const buildCursor = (row: {
  pctPositive: number;
  totalReviews: number;
  gamePassId: string;
}) =>
  JSON.stringify({
    pctPositive: row.pctPositive,
    totalReviews: row.totalReviews,
    gamePassId: row.gamePassId,
  } satisfies Cursor);

/* --------------- main handler ------------- */

export const getHighestRating = async (c: Context) => {
  const {
    userId,
    take = 100,
    ascending = false,
    cursor,
    reviews = 1,
    date = 7,
  } = (await c.req.json().catch(() => ({}))) as Record<string, any>;

  if (!userId) return c.json({ error: "userId required" }, 400);

  const dir = ascending ? Prisma.sql`ASC` : Prisma.sql`DESC`;

  /* optional “past N days” filter */
  const timeFilter =
    date > 0
      ? Prisma.sql`AND r.time >= ${new Date(Date.now() - date * 86_400_000)}`
      : Prisma.sql``;

  const rows = await prisma.$queryRaw<
    Array<{
      gamePassId: string;
      totalReviews: bigint; // MySQL returns bigint for COUNT/SUM
      positiveReviews: bigint;
      pctPositive: number;
    }>
  >(Prisma.sql`
    WITH ranked AS (
      SELECT
        g.gamePassId,
        COUNT(r.reviewId)               AS totalReviews,
        SUM(r.recommends)               AS positiveReviews,
        AVG(r.recommends)               AS pctPositive       -- cleaner than SUM/COUNT
      FROM gamePass  g
      JOIN review r  ON r.gamePassId = g.gamePassId
      WHERE r.deleted = FALSE
        ${timeFilter}
      GROUP BY g.gamePassId
      HAVING COUNT(*) >= ${reviews}
    )
    SELECT *
    FROM ranked g
    WHERE 1 = 1
      ${cursorPredicate(cursor)}
    ORDER BY pctPositive ${dir},
             totalReviews ${dir},
             g.gamePassId ${dir}
    LIMIT ${take}
  `);

  const games = rows.map((r) => ({
    gamePassId: r.gamePassId,
    totalReviews: Number(r.totalReviews),
    positiveReviews: Number(r.positiveReviews),
    pctPositive: Number(r.pctPositive),
  }));

  return {
    games,
    nextCursor: games.length ? buildCursor(games[games.length - 1]) : null,
  };
};
