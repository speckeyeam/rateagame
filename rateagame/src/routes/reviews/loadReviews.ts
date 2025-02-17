import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { gameCheck } from "../helpers/gameCheck";

export const loadReviews = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  let dataStore1;
  let dataStore2: String;
  let gameId;

  if (requestData.gameId) {
    dataStore1 = requestData.gameId + "likes";
    dataStore2 = requestData.gameId + "reviews";
    gameId = requestData.gameId;

    await gameCheck(gameId, false);
  }

  const game = await prisma.game.findUnique({
    where: {
      gameId: gameId.toString(),
    },
  });
  if (!game) {
    const newgame = await prisma.game.create({
      data: {
        gameId: gameId.toString(),
      },
    });
  }

  const UNIVERSE_ID = 6775462923; // e.g. the Universe ID from Creator Dashboard
  const url = `https://apis.roblox.com/ordered-data-stores/v1/universes/${UNIVERSE_ID}/orderedDataStores/${dataStore1}/scopes/global/entries?max_page_size=100&order_by=desc`;
  console.log(url);
  //forget about doing this stuff, just load everything in on the roblox server, and then return everything here lol
  try {
    // 3. Make the request to Roblox Open Cloud
    const robloxResponse = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    });

    // 4. Handle any errors from Roblox
    if (!robloxResponse.ok) {
      const errorText = await robloxResponse.text();
      //   console.log(robloxResponse + " test");
      console.error("Roblox API Error:", robloxResponse.status, errorText);
      return c.json(
        {
          success: false,
          status: robloxResponse.status,
          error: errorText,
        },
        500
      );
    }

    // 5. Parse response from Roblox (list of data stores)
    const data = await robloxResponse.json();
    // console.log(data);
    // console.log(data);
    console.log(data);
    let table = data.entries;
    table.forEach(async (review: any) => {
      //   console.log(review.id);

      const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`;

      // Define query parameters
      const queryParams = new URLSearchParams({
        datastoreName: dataStore2,
        entryKey: review.id,
      }).toString();

      let userId = review.id.split(".")[0];

      // Full URL with query parameters
      const fullUrl = `${url}?${queryParams}`;
      //   console.log(url);
      try {
        // 3. Make the request to Roblox Open Cloud
        const robloxResponse = await fetch(fullUrl, {
          method: "GET",
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        });

        // 4. Handle any errors from Roblox
        if (!robloxResponse.ok) {
          const errorText = await robloxResponse.text();
          //   console.log(robloxResponse + " test");
          console.error("Roblox API Error:", robloxResponse.status, errorText);
          return c.json(
            {
              success: false,
              status: robloxResponse.status,
              error: errorText,
            },
            500
          );
        }
        const data = await robloxResponse.json();
        // console.log(data);
        let reviewId = review.id;
        let recommends = data.recommends;
        let date = new Date((data.date || 0) * 1000);
        let reviewtext = data.review;
        console.log(recommends);
        console.log(date);
        console.log(reviewtext);
        console.log(gameId);

        const checkreview = await prisma.review.findUnique({
          where: {
            reviewId,
          },
        });

        const checkuser = await prisma.user.findUnique({
          where: {
            userId,
          },
        });

        if (!checkuser) {
          const newuser = await prisma.user.create({
            data: {
              userId,
              dateJoined: new Date(),
              coins: 150,
            },
          });
        }
        //         // model reviewData {
        //   reviewId   String   @unique
        //   time       DateTime
        //   text       String   @db.VarChar(2000)
        //   likes      like[]
        //   review     review[]
        //   awards     award[]
        //   gameId     String
        //   recommends Boolean
        // }
        if (!checkreview) {
          const newreviewdata = await prisma.reviewData.create({
            data: {
              reviewId,
              time: date,
              text: reviewtext,
              gameId,
              userId,
              recommends,
            },
          });
          //   review     reviewData @relation(fields: [reviewId], references: [reviewId])
          //   time       DateTime
          //   reviewId   String     @id //this will be the time + userid + gameid
          //   gameId     String
          //   user       user?      @relation(fields: [userId], references: [userId])
          //   userId     String?
          //   recommends Boolean
          //   game       game?      @relation(fields: [gameId], references: [gameId])
          //   gamePass   Boolean    @default(false)
          const newreview = await prisma.review.create({
            data: {
              reviewId,
              time: date,
              userId,
              gameId,
              recommends,
            },
          });
        }
      } catch (err) {
        // Catch any network or runtime errors
        console.error("Error fetching data from Roblox:", err);
        return c.json({ success: false, error: String(err) }, 500);
      }
    });
    // console.log(Object.keys(data.entries).length + " test");
    // console.log("Ordered DataStores:", data);

    // 6. Send back the list as JSON
    return c.json({ success: true, dataStores: data }, 200);
  } catch (err) {
    // Catch any network or runtime errors
    console.error("Error fetching data from Roblox:", err);
    return c.json({ success: false, error: String(err) }, 500);
  }

  console.log(requestData);
  return c.json({ success: true }, 500);
};
