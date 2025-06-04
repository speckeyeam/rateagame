import { Hono } from "hono";
import reviewsRoute from "./reviews";
import playersRoute from "./player";
import savedGamesRoute from "./savedGames";
import chartsRoute from "./charts";
import apisRoute from "./apis";
import awardsRoute from "./awards";
import feedRoute from "./feed";
import billboardsRoute from "./billboards";
import billboards2Route from "./billboards2";
import gdprRoute from "./gdpr";
import gameRoute from "./game";

const router = new Hono();

// Mount the reviews route on /reviews
router.route("/reviews", reviewsRoute);

router.route("/player", playersRoute);

router.route("/savedGames", savedGamesRoute);

router.route("/charts", chartsRoute);

router.route("/apis", apisRoute);

router.route("/awards", awardsRoute);

router.route("/feed", feedRoute);

router.route("/gdpr", gdprRoute);

router.route("/billboards", billboardsRoute);
router.route("/billboards2", billboards2Route);
router.route("/game", gameRoute);

export default router;
