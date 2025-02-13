import { Hono } from "hono";

import { giveAward } from "./giveAward";
import { loadAwards } from "./loadAwards";
import { loadReviewAwards } from "./loadReviewAwards";

const app = new Hono();

app.post("/giveAward", giveAward);
app.post("/loadAwards", loadAwards);
app.post("/loadReviewAwards", loadReviewAwards);

export default app;
