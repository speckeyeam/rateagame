import { Hono } from "hono";
import reviewsRoute from "./reviews";
import playersRoute from "./player";
import savedGamesRoute from "./savedGames";
import chartsRoute from "./charts";
import apisRoute from "./apis";
import awardsRoute from "./awards";
import feedRoute from "./feed";

const router = new Hono();

// Mount the reviews route on /reviews
router.route("/reviews", reviewsRoute);

router.route("/player", playersRoute);

router.route("/savedGames", savedGamesRoute);

router.route("/charts", chartsRoute);

router.route("/apis", apisRoute);

router.route("/awards", awardsRoute);

router.route("/feed", feedRoute);

export default router;
