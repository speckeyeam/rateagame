import { Hono } from "hono";

import { isGameSaved } from "./isGameSaved";
import { getSavedGames } from "./getSavedGames";
import { saveGame } from "./saveGame";

const app = new Hono();

app.post("/saveGame", saveGame);
app.post("/getSavedGames", getSavedGames);
app.post("/isGameSaved", isGameSaved);

export default app;
