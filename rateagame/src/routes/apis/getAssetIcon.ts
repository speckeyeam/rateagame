import { Context } from "hono";

import { apikeycheck } from "../helpers/apikeycheck";

async function getUniverseId(placeId: any) {
  console.log(placeId);
  const universeUrl = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;
  try {
    const response = await fetch(universeUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch universe ID: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    if (data.universeId) {
      const universeId = data.universeId;
      console.log("Universe ID:", universeId);
      return universeId;
    }
  } catch (error) {
    console.error("Error fetching Universe ID:", error);
  }
}
///test
async function geGameIcon(universeId: any) {
  const gameIconUrl = `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`;

  try {
    const response = await fetch(gameIconUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch game icon: ${response.status}`);
    }
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      console.log("Game Icon URL:", data.data[0].imageUrl);
      return data.data[0].imageUrl;
    }
  } catch (error) {
    console.error("Error fetching game icon:", error);
  }
}

async function getGamePassIcon(gamePassId: any) {
  try {
    const gamePassUrl = `https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${gamePassId}&size=150x150&format=Png&isCircular=false`;

    const response = await fetch(gamePassUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch GamePass thumbnail: ${response.status}`);
    }
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      console.log("GamePass Icon URL:", data.data[0].imageUrl);
      return data.data[0].imageUrl;
    }
  } catch (error) {
    console.error("Error fetching GamePass thumbnail:", error);
  }
}

export const getAssetIcon = async (c: Context) => {
  const requestData = await c.req.json().catch(() => null); // catch in case no JSON is sent

  const { assetId, gamePass = false } = requestData;
  //finish this later lol
  let apicheck = await apikeycheck(c);
  if (apicheck) {
    let universeId: any;
    if (assetId) {
      if (!gamePass) {
        universeId = await getUniverseId(assetId);
        let icon = await geGameIcon(universeId);
        console.log(icon);
        return c.json({ success: true, icon }, 200);
      } else {
        let icon = await getGamePassIcon(assetId);
        return c.json({ success: true, icon }, 200);
      }
    }
  }

  return c.json({ success: false }, 500);
};

//THIS CODE WORKS FOR GETTING A GAMEPASS ICON!
// const gamePassId = "INSERT_GAMEPASS_ID_HERE";

// async function getGamePassThumbnail() {
//   try {
//     const response = await fetch(gamePassUrl);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch GamePass thumbnail: ${response.status}`);
//     }
//     const data = await response.json();

//     if (data.data && data.data.length > 0) {
//       console.log("GamePass Icon URL:", data.data[0].imageUrl);
//       return data.data[0].imageUrl;
//     }
//   } catch (error) {
//     console.error("Error fetching GamePass thumbnail:", error);
//   }
// }

// getGamePassThumbnail();
