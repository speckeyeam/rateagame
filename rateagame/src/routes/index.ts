import { Hono } from "hono";
import reviewsRoute from "./reviews";
import playersRoute from "./player";

const router = new Hono();

// Mount the reviews route on /reviews
router.route("/reviews", reviewsRoute);

router.route("/players", playersRoute);

export default router;
