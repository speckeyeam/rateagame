// import { Context } from "hono";

// import { PrismaClient } from "@prisma/client";

// import { playerCheck } from "../helpers/playerCheck";
// import { gameCheck } from "../helpers/gameCheck";

// import { mostLiked } from "./chartTypes/getMostLiked";
// import { mostAwarded } from "./chartTypes/getMostAwarded";

// const prisma = new PrismaClient();

// export const getCharts = async (c: Context) => {
//   const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

//   const { userId, token, call } = await requestData;

//   console.log(requestData);
//   if (userId && token && call) {
//     let player: any = await playerCheck(c);
//     if (player) {
//       const lowestRated = await getLowestRated(c);
//       const trending = await getTrending(c);

//       //const recentlyReviewed = getRecentlyReviewed(c); get the rest with this, highest lowest, etc
//       return c.json(
//         {
//           success: true,
//           recentlyReviewed,
//           topRated,
//           lowestRated,
//           trending,
//           mostReviewed,
//         },
//         200
//       );
//     }
//   }
//   return c.json({ success: false }, 500);
// };
