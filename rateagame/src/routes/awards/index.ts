import { Hono } from "hono";

import { giveAward } from "./giveAward";
import { loadAwards } from "./loadAwards";

const app = new Hono();

app.post("/giveAward", giveAward);
app.post("/loadAwards", loadAwards);

export default app;
