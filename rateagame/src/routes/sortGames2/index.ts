// `const minReviews = 20;              // 👈  set your threshold here

// const gamesByPositivity = await prisma.$queryRaw<
//   Array<{
//     gameId: string;
//     Name: string | null;
//     totalReviews: number;
//     positiveReviews: number;
//     pctPositive: number;
//   }>
// >`
//   SELECT
//     g.gameId,
//     g.Name,
//     COUNT(r.reviewId)                                   AS totalReviews,
//     SUM(CASE WHEN r.recommends = TRUE THEN 1 ELSE 0 END) AS positiveReviews,
//     ROUND(SUM(CASE WHEN r.recommends = TRUE THEN 1 ELSE 0 END)
//           / COUNT(r.reviewId) * 100, 2)                 AS pctPositive
//   FROM game g
//   JOIN review r ON r.gameId = g.gameId
//   WHERE r.deleted = FALSE                                -- ignore “deleted” reviews
//   GROUP BY g.gameId
//   HAVING totalReviews >= ${minReviews}
//   ORDER BY pctPositive DESC, totalReviews DESC;
// `;

// console.table(gamesByPositivity);
