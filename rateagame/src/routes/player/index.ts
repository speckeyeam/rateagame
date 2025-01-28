import { Hono } from "hono";

import { playerAdded } from "./playerAdded";

const app = new Hono();

app.post("/playerAdded", playerAdded);

export default app;
