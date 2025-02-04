// //honestly just like get all the reviews, or something like a 100 reviews max. when the maximum is reached, on roblox, get the time of the oldest or newest one (depending on the sort method) and use that as a filter to load reviews that came after or before that.
// import { Context } from "hono";

// import { PrismaClient } from "@prisma/client";

// import { playerCheck } from "../../helpers/playerCheck";
// import { gameCheck } from "../../helpers/gameCheck";

// const prisma = new PrismaClient();
// //gets the most trending games in the past week, games with the most reviews, could get the most trending games and games passes in the last x amount of days
// export const getMostReviewed = async (c: Context) => {
//   const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

//   const {
//     gameId,
//     userId,
//     gamePass, // Default to false if not provided
//     take,
//   } = requestData;

//   if (gameId && userId && take) {
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - days);
//     const data: any = {
//       by: gamePass ? ["gamePassId"] : ["gameId"], // Group by game or game pass
//       where: {
//         deleted: false, // Only non-deleted reviews
//       },
//       _count: {
//         [gamePass ? "gamePassId" : "gameId"]: true, // Count based on grouping field
//       },
//       orderBy: {
//         _count: {
//           [gamePass ? "gamePassId" : "gameId"]: "desc", // Sort by highest review count
//         },
//       },
//       take: take, // Get top 4 gam
//     };

//     const recentlyReviewed = await prisma.review.groupBy(data);

//     if (recentlyReviewed) {
//       return recentlyReviewed;
//     }
//   }

//   return null;
// };

//WHY DID I COMMENT THIS OUT? CUZ ITS THE EXACT SAME CODE AS THE TRENDING ONE! JUST DO SOME REALLY BIG NUMBER LIKE 600 MILLION YEARS FOR THE DAYS VALUE
