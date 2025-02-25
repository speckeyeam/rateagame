import { Hono } from "hono";

import { getGameThumbnails } from "./getGameThumbnails";

import { getAssetInfo } from "./getAssetInfo";

const app = new Hono();

app.post("/getGameThumbnails", getGameThumbnails);

app.post("/getAssetInfo", getAssetInfo);

export default app;
