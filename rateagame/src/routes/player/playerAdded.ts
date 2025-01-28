import { Context } from "hono";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const playerAdded = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null);

  let userId = requestData.userId;

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

      return c.json({ success: true, dataStores: data }, 200);
    } catch (err) {
      // Catch any network or runtime errors
      console.error("Error fetching data from Roblox:", err);
      return c.json({ success: false, error: String(err) }, 500);
    }
  }
  return c.json({ success: false }, 500);
};
