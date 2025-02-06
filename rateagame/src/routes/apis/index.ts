import { Hono } from "hono";

import { getGameThumbnails } from "./getGameThumbnails";

const app = new Hono();

app.post("/getCharts", getGameThumbnails);

export default app;
