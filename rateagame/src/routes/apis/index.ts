import { Hono } from "hono";

import { getGameThumbnails } from "./getGameThumbnails";

import { getAssetInfo } from "./getAssetInfo";

import { getLeaderboard } from "./getLeaderboard";

const app = new Hono();

app.post("/getGameThumbnails", getGameThumbnails);

app.post("/getAssetInfo", getAssetInfo);

app.post("/getLeaderboard", getLeaderboard);

export default app;
