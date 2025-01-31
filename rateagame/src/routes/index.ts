import { Hono } from "hono";
import reviewsRoute from "./reviews";
import playersRoute from "./player";
import savedGamesRoute from "./savedGames";

const router = new Hono();

// Mount the reviews route on /reviews
router.route("/reviews", reviewsRoute);

router.route("/player", playersRoute);

router.route("/savedGames", savedGamesRoute);

export default router;
