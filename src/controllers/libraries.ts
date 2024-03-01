import express from "express";
import { getGames, addGame } from "../db/libraries";
import { get } from "lodash";
import { getUserById } from "../db/users";

export const getLibraryGames = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const user = await getUserById(get(req, "identity"));

        if (!user || !user.library) {
           res.status(404).send("Library not found for the user.");
           return
        }

        const games = await getGames(user.library._id.toString());

        if (!games || games.length === 0) {
            res.status(404).send("No games found in library.");
            return;
        }

        res.json(games);
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching games from the library.");
    }
};

export const addGamesToLibrary = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const user = await getUserById(get(req, "identity"));
        const { gameId } = req.body;

        if (!user || !user.library) {
            res.status(404).send("Library not found for the user.");
        }

        if (!gameId) {
            res.status(400).send("Game ID must be provided.");
        }

        await addGame(user.library._id.toString(), gameId);

        res.status(200).send("Game added to library successfully.");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while adding the game to the library.");
    }
};