import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import md5 from "md5";
import { Buffer } from "buffer"; // Bun provides this natively.
//test
async function generateContentMD5(content: string) {
  const hash = md5(content);

  // Convert the hash to a Base64 string
  const contentMD5 = Buffer.from(hash, "hex").toString("base64");

  return contentMD5;
}

export const playerAdded = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null);

  let userId = String(requestData.userId);

  if (userId) {
    // const UNIVERSE_ID = 6775462923; --real game
    const UNIVERSE_ID = 7146581911; //testing game

    const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`;
    const queryParams = new URLSearchParams({
      datastoreName: "tokens",
      entryKey: String(userId),
    }).toString();

    // Full URL with query parameters
    const fullUrl = `${url}?${queryParams}`;
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
        const data = await robloxResponse.json();
        console.log(data);

        //just check if the user already exists and if it does return the token otherwise create a new user

        const newUser = await prisma.user.create({
          data: {
            userId,
            dateJoined: new Date(),
            coins: 150,
          },
        });
        if (newUser) {
          return c.json({ success: true, token: newUser.token }, 200);
          //   const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`;
          //   const queryParams = new URLSearchParams({
          //     datastoreName: "tokens",
          //     entryKey: userId,
          //     scope: "global",
          //   }).toString();
          //   // Full URL with query parameters
          //   const fullUrl = `${url}?${queryParams}`;
          //   try {
          //     // 3. Make the request to Roblox Open Cloud
          //     console.log(userId);
          //     const robloxResponse = await fetch(fullUrl, {
          //       method: "POST",
          //       headers: {
          //         "x-api-key": process.env.API_KEY,
          //         "content-md5": generateContentMD5(newUser.token),
          //         "content-type": "application/json",
          //       },
          //       body: JSON.stringify(newUser.token),
          //     });
          //     if (robloxResponse.ok) {
          //       console.log(robloxResponse);
          //       return c.json({ success: true }, 200);
          //     }
          //     console.log(robloxResponse);
          //   } catch (err) {
          //     // Catch any network or runtime errors
          //     console.error("Error fetching data from Roblox:", err);
          //     return c.json({ success: false, error: String(err) }, 500);
          //   }
          //   return c.json({ success: false }, 200);
        } else {
          return c.json({ success: false }, 200);
        }
      }

      // 5. Parse response from Roblox (list of data stores)
      const data = await robloxResponse.json();
      // console.log(data);
      // console.log(data);

      let table = data.entries;
      console.log(data);
      return c.json({ success: true }, 200);
    } catch (err) {
      // Catch any network or runtime errors
      console.error("Error fetching data from Roblox:", err);
      return c.json({ success: false, error: String(err) }, 500);
    }
  }
  return c.json({ success: false }, 500);
};
