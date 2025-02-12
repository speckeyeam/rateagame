import { Hono } from "hono";
import { getPoints } from "./getPoints";
import { updatePoints } from "./updatePoints";

import { playerAdded } from "./playerAdded";

const app = new Hono();

app.post("/playerAdded", playerAdded);

app.post("/getPoints", getPoints);

app.post("/updatePoints", updatePoints);

export default app;
