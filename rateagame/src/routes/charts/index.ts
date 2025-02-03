import { Hono } from "hono";

import { getRecentlyReviewed } from "./getRecentlyReviewed";

const app = new Hono();

app.post("/getRecentlyReviewed", getRecentlyReviewed);

export default app;
