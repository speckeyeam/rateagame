import { Hono } from "hono";

import { addPoints } from "./addPoints";

const app = new Hono();

app.post("/addPoints", addPoints);

export default app;
