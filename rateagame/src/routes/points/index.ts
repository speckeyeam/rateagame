import { Hono } from "hono";

import { redeemFree } from "./redeemFree";

const app = new Hono();

app.post("/redeemFree", redeemFree);

export default app;
