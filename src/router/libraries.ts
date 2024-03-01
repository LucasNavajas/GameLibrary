import express from "express";
import { get } from "lodash";
import { getUserById } from "../db/users";
import { isAuthenticated } from "../middlewares";
import { getLibraryGames, addGamesToLibrary } from "../controllers/libraries"; // Adjust the import path as needed

export default (router: express.Router) =>{
    router.get("/library", isAuthenticated, async (req: express.Request, res: express.Response) => {
        try {
            const userId = get(req, "identity._id");
            if (!userId) {
                return res.status(404).send("User not found");
            }
            const user = await getUserById(userId);
            if (!user) {
                return res.status(404).send("User not found");
            }
            const userLibrary = user.library;
            res.status(200).json(userLibrary);
        } catch(error) {
            console.log(error);
            res.sendStatus(400);
        }
    });

    router.get("/library/games", isAuthenticated, getLibraryGames);

    // Route to add a game to a library, updated to use the addGamesToLibrary controller method
    router.post("/library/games", isAuthenticated, addGamesToLibrary);
}