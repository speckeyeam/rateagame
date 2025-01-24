import { Hono } from "hono";

const app = new Hono();

app
  .get("/", (c) => c.text("Server is running!"))
  .post("/loadReviews", async (c) => {
    console.log("Webhook received:", await c.req.json());
    return c.json({ success: true });
  });

export default app;
