import express from "express";

import { getGames } from "../db/libraries";

export const getLibraryGames = async (req: express.Request, res: express.Response) => {
    try{
        const { id }  = req.params;  

        const games = await getGames(id);

        return res.status(200).json(games);
    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}