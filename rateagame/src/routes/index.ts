import { Hono } from "hono";
import reviewsRoute from "./reviews";
import playersRoute from "./player";
import savedGamesRoute from "./savedGames";
import chartsRoute from "./charts";
import apisRoute from "./apis";

const router = new Hono();

// Mount the reviews route on /reviews
router.route("/reviews", reviewsRoute);

router.route("/player", playersRoute);

router.route("/savedGames", savedGamesRoute);

router.route("/charts", chartsRoute);

router.route("/apis", apisRoute);

export default router;
