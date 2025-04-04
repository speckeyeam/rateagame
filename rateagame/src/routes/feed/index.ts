import { Hono } from "hono";

import { getFeed } from "./getFeed";

import { viewReview } from "./viewReview";

const app = new Hono();

app.post("/getFeed", getFeed);

app.post("/viewReview", viewReview);

export default app;
