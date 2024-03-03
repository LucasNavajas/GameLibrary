import express from "express";

import * as GameController from "../controllers/games";

export default(router: express.Router) =>{ //Router with all the endpoints related to games
    router.post("/games", GameController.newGame);
    router.get("/games", GameController.getAllGames);
    router.get("/games/:id", GameController.getGame);
    router.get("/games/age/:age", GameController.getGameMinimumAge);
    router.get("/games/players/multiplayer", GameController.getGameMultiplayer);
    router.get("/games/players/singleplayer", GameController.getGameSingleplayer);
    router.get("/games/genre/:id", GameController.getGamesGenre);
    router.get("/games/date/prevDate", GameController.getGamePrevDate);
    router.get("/games/date/postDate", GameController.getGamePostDate);
    router.delete("/games/:id", GameController.deleteGame);
}