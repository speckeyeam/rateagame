// //honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
// import { Context } from "hono";

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// //gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
// export const mostLiked = async (c: Context, days: num) => {
//   const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

//   const {
//     gamePass = false, // Default to false if not provided
//     take,
//   } = requestData;
//   const oneDayAgo = new Date();

//   oneDayAgo.setDate(oneDayAgo.getDate() - 7);

//   const awardCounts = await prisma.award.groupBy({
//     by: ["reviewId"],
//     where: {
//       time: {
//         gte: oneDayAgo,
//       },
//     },
//     _count: {
//       reviewId: true,
//     },
//     orderBy: {
//       _count: {
//         reviewId: "desc",
//       },
//     },
//     take: 20,
//   });
//   const reviewIds = awardCounts.map((a) => a.reviewId);

//   const reviews = await prisma.review.findMany({
//     where: {
//       reviewId: {
//         in: reviewIds,
//       },
//     },
//     include: {
//       user: true,
//       game: true,
//       awards: true,
//     },
//   });

//   // Step 3: Merge award counts into review results
//   const reviewMap = new Map(reviews.map((r) => [r.reviewId, r]));
//   const result = awardCounts.map((a) => ({
//     ...reviewMap.get(a.reviewId),
//     awardCount: a._count.reviewId,
//   }));
//   return { reviews: result };
// };
