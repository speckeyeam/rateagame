import { Hono } from "hono";

import { giveAward } from "./giveAward";
import { giveAwardGame } from "./giveAwardGame";
import { loadAwards } from "./loadAwards";
import { loadReviewAwards } from "./loadReviewAwards";
import { loadGameAwards } from "./loadGameAwards";

const app = new Hono();

app.post("/giveAward", giveAward);
app.post("/loadAwards", loadAwards);
app.post("/loadReviewAwards", loadReviewAwards);
app.post("/giveAwardGame", giveAwardGame);
app.post("/loadGameAwards", loadGameAwards);
export default app;
