import { Hono } from "hono";
import reviewsRoute from "./reviews";

const router = new Hono();

// Mount the reviews route on /reviews
router.route("/reviews", reviewsRoute);

export default router;
