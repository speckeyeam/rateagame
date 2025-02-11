import { Hono } from "hono";
import { getPoints } from "./getPoints";

import { playerAdded } from "./playerAdded";

const app = new Hono();

app.post("/playerAdded", playerAdded);

app.post("/getPoints", getPoints);

export default app;
