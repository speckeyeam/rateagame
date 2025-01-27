import { Context } from "hono";

export const loadReviews = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  console.log("Data received:", requestData);

  let dataStore1;
  if (requestData.gameId) {
    dataStore1 = requestData.gameId + "likes";
  }

  const API_KEY =
    "WssUpS1RHk+q6Gyx7owGPtK/XpE3Vs0S7igVxb64/CYIhoA8ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaVlYTmxRWEJwUzJWNUlqb2lWM056VlhCVE1WSklheXR4TmtkNWVEZHZkMGRRZEVzdldIQkZNMVp6TUZNM2FXZFdlR0kyTkM5RFdVbG9iMEU0SWl3aWIzZHVaWEpKWkNJNklqSXpNRFl3TmpNeU5DSXNJbUYxWkNJNklsSnZZbXh2ZUVsdWRHVnlibUZzSWl3aWFYTnpJam9pUTJ4dmRXUkJkWFJvWlc1MGFXTmhkR2x2YmxObGNuWnBZMlVpTENKbGVIQWlPakUzTXpjM05UZzVOVGNzSW1saGRDSTZNVGN6TnpjMU5UTTFOeXdpYm1KbUlqb3hOek0zTnpVMU16VTNmUS5JclI1NzdWWmFHNFp2c21UMGpSWmZUbDBmbk5ncXVpV1JXNzFoTm01Q3FTWTFWLUxQaV9feFlza1BMRWNrSlVmblZaU25RUk1Id1YyTnlfQkQ5QWZqQkxLMmxCMzBSR0VnUGF4eHNWVmQ1S1Bsb205T2I5dTNKTUNpWWJLdnJjV2NtWGJSbnU4MWcxbHhFMDUwTVg2alZ6akluN1BzVzhSMHlmVzIxa3RCUl9TdHFqaV93NF9uV252b3ZYZFB4VkE2NExnbVRJa1hib2FxY1ktcFZTZVNoMnlYNHlHcWtXaW5XdXFKZjZLTnM0OTYtWkdIdjRzbDBjbno2VnE4TkdFcjNRUlZCeDk3OGtibnkyRGxMVDdGdmpqaEZJRVBOb3BjQXBUWmFOR1JjNGlkZ25TaUR6MWs1R3FpdlcxcXVZTUQ0RFpibFFoV01ySGFCZDdNOUNCcUE=";
  const UNIVERSE_ID = 6775462923; // e.g. the Universe ID from Creator Dashboard
  const url = `https://apis.roblox.com/ordered-data-stores/v1/universes/${UNIVERSE_ID}/orderedDataStores/${dataStore1}/scopes/global/entries?max_page_size=100&order_by=desc`;

  try {
    // 3. Make the request to Roblox Open Cloud
    const robloxResponse = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    });

    // 4. Handle any errors from Roblox
    if (!robloxResponse.ok) {
      const errorText = await robloxResponse.text();
      console.log(robloxResponse + " test");
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
    console.log(data.entries);

    console.log(Object.keys(data.entries).length + " test");
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
