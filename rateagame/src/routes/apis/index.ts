import { Hono } from "hono";

import { getGameThumbnails } from "./getGameThumbnails";

import { getAssetIcon } from "./getAssetIcon";

const app = new Hono();

app.post("/getGameThumbnails", getGameThumbnails);

app.post("/getAssetIcon", getAssetIcon);

export default app;
