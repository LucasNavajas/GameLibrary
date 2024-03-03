import express from "express";
import { isAuthenticated } from "../middlewares";
import { getLibraryGames, addGamesToLibrary, removeGamesFromLibrary, getLoggedInUserLibrary } from "../controllers/libraries";


export default (router: express.Router) =>{//Router defined with the library endpoints
    router.get("/library", isAuthenticated, getLoggedInUserLibrary);
    router.get("/library/games", isAuthenticated, getLibraryGames);
    router.patch("/library/games/add", isAuthenticated, addGamesToLibrary);
    router.patch("/library/games/remove", isAuthenticated, removeGamesFromLibrary);
}