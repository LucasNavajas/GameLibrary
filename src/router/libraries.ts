import express from "express";

import { get } from "lodash";
import { getUserById } from "../db/users";
import { isAuthenticated } from "../middlewares";
import { getGames } from "../db/libraries";

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

    router.get("/library/games", isAuthenticated, async (req: express.Request, res: express.Response) => {
        try {
            const userId = await get(req, "identity._id");
            if (!userId) {
                return res.status(404).send("User not found");
            }
            const user = await getUserById(userId);
            if (!user) {
                return res.status(404).send("User not found");
            }
            if (user.library === undefined) {
                return res.status(400).send("User library is undefined.");
            }
            const games = await getGames(user.library._id.toString());
            res.json(games);
        } catch(error) {
            console.log(error);
            res.status(400).send("An error occurred while fetching the games.");
        }
    });
}