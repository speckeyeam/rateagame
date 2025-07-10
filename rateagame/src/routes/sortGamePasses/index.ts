import { Hono } from "hono";

import { sort } from "./sort";

const app = new Hono();

app.post("/sort", sort);

export default app;
