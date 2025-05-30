import { Hono } from "hono";

import { getParent } from "./getParent";

const app = new Hono();

app.post("/getParent", getParent);

export default app;
