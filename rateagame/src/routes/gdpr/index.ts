import { Hono } from "hono";

import { deleteUser } from "./delete";

const app = new Hono();

app.post("/delete", deleteUser);

export default app;
