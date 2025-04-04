import { Hono } from "hono";

import { getFeed } from "./getFeed";

import { viewedReview } from "./viewedReview";

const app = new Hono();

app.post("/getFeed", getFeed);

app.post("/viewedReview", viewedReview);

export default app;
