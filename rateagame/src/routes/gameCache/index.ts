import { Hono } from "hono";

import { getCache } from "./getCache";
import { setCache } from "./setCache";

const app = new Hono();

app.post("/getCache", getCache);
app.post("/setCache", setCache);

export default app;
