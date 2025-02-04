import { Hono } from "hono";

import { getCharts } from "./getCharts";

const app = new Hono();

app.post("/getCharts", getCharts);

export default app;
