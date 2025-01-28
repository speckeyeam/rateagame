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
    const UNIVERSE_ID = 6775462923;
    const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`;
    const queryParams = new URLSearchParams({
      datastoreName: "tokens",
      entryKey: userId,
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
        const newUser = await prisma.user.create({
          data: {
            userId,
            dateJoined: new Date(),
            coins: 150,
          },
        });
        if (newUser) {
          const url = `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`;
          const queryParams = new URLSearchParams({
            datastoreName: "tokens",
            entryKey: userId,
          }).toString();

          // Full URL with query parameters
          const fullUrl = `${url}?${queryParams}`;
          try {
            // 3. Make the request to Roblox Open Cloud
            const robloxResponse = await fetch(fullUrl, {
              method: "POST",
              headers: {
                "x-api-key": process.env.API_KEY,
                "content-md5": generateContentMD5(newUser.token),
                "content-type": "application/json",
                "roblox-entry-userids": "[269323]",
                "roblox-entry-attributes": "{}",
              },
              body: JSON.stringify(newUser.token),
            });

            if (robloxResponse.ok) {
              return c.json({ success: true }, 200);
            }

            console.log(robloxResponse);
          } catch (err) {
            // Catch any network or runtime errors
            console.error("Error fetching data from Roblox:", err);
            return c.json({ success: false, error: String(err) }, 500);
          }

          return c.json({ success: false }, 200);
        } else {
          return c.json({ success: false }, 200);
        }
      }

      // 5. Parse response from Roblox (list of data stores)

      return c.json({ success: true }, 200);
    } catch (err) {
      // Catch any network or runtime errors
      console.error("Error fetching data from Roblox:", err);
      return c.json({ success: false, error: String(err) }, 500);
    }
  }
  return c.json({ success: false }, 500);
};
