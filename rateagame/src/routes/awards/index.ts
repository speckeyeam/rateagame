import { Hono } from "hono";

import { giveAward } from "./giveAward";

const app = new Hono();

app.post("/giveAward", giveAward);

export default app;
