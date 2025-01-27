import { Context } from "hono";

export const loadReviews = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  console.log("Data received:", requestData);

  // 2. Construct the URL for listing Ordered Data Stores
  //   local datastore =
  //   const url = `https://apis.roblox.com/ordered-data-stores/v1/universes/${UNIVERSE_ID}/orderedDataStores/${UNIVERSE_ID}/scopes/global/entries?max_page_size=100&order_by=desc`;

  //   try {
  //     // 3. Make the request to Roblox Open Cloud
  //     const robloxResponse = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "x-api-key": API_KEY,
  //       },
  //     });

  //     // 4. Handle any errors from Roblox
  //     if (!robloxResponse.ok) {
  //       const errorText = await robloxResponse.text();
  //       console.log(robloxResponse + " test");
  //       console.error("Roblox API Error:", robloxResponse.status, errorText);
  //       return c.json(
  //         {
  //           success: false,
  //           status: robloxResponse.status,
  //           error: errorText,
  //         },
  //         500
  //       );
  //     }

  //     // 5. Parse response from Roblox (list of data stores)
  //     const data = await robloxResponse.json();
  //     console.log(data.entries);

  //     console.log(Object.keys(data.entries).length + " test");
  //     // console.log("Ordered DataStores:", data);

  //     // 6. Send back the list as JSON
  //     return c.json({ success: true, dataStores: data }, 200);
  //   } catch (err) {
  //     // Catch any network or runtime errors
  //     console.error("Error fetching data from Roblox:", err);
  //     return c.json({ success: false, error: String(err) }, 500);
  //   }

  //   console.log(requestData);
  //   return c.json({ success: true }, 500);
};
