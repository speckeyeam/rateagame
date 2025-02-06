import { Hono } from "hono";

import { getGameThumbnails } from "./getGameThumbnails";

const app = new Hono();

app.post("/getGameThumbnails", getGameThumbnails);

export default app;
