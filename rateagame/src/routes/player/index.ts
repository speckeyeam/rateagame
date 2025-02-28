import { Hono } from "hono";
import { getPoints } from "./getPoints";
import { updatePoints } from "./updatePoints";
import { getProfile } from "./getProfile";

import { playerAdded } from "./playerAdded";
import { recentlyReviewed } from "./recentlyReviewed";

import { getAwardsInfo } from "./getAwardsInfo";

const app = new Hono();

app.post("/playerAdded", playerAdded);

app.post("/getPoints", getPoints);

app.post("/updatePoints", updatePoints);

app.post("/getProfile", getProfile);

app.post("/getRecentlyReviewd", recentlyReviewed);

app.post("/getAwardsInfo", getAwardsInfo);

export default app;
