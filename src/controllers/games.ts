import express from "express";

import {CreateGame, getGames, getGameById, deleteGameById, getGamesByGenre, getGamesByMinimumAge, getGamesFromDateBackwards, getGamesFromDateOnwards, getMultiplayerGames, getSingleplayerGames } from "../db/games";

//Methods related to the game instances
export const newGame = async (req: express.Request, res: express.Response) =>{
    const { title, genre, releaseDate, description, multiplayer, picture, minimumAge } = req.body;

    if (!title || !genre || !releaseDate || !description || multiplayer === undefined || !minimumAge) { //Check all the required values
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const game = await CreateGame({ title, genre, releaseDate, description, multiplayer, picture, minimumAge }); //Create the game through GameModel.CreateGame
        return res.status(201).json(game);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating new game" });
    }

}

export const getAllGames = async (req: express.Request, res: express.Response) =>{ //Retrieve all games
    try{
        const games = await getGames();
        res.status(200).json(games);
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}
export const getGame = async (req: express.Request, res: express.Response) =>{ //Get a game through its id
    try{
        const { id } = req.params;

        const game = await getGameById(id);

        return res.status(200).json(game);
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}
export const deleteGame = async (req: express.Request, res: express.Response) =>{ 
    try{
        const { id } = req.params;

        const game = await deleteGameById(id);

        return res.status(200).json(game);
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}
export const getGamesGenre = async (req: express.Request, res: express.Response) =>{ //Get games of a specific genre
    try{
        const { id } = req.params;

        const game = await getGamesByGenre(id);

        return res.status(200).json(game);
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}
export const getGameMinimumAge = async (req: express.Request, res: express.Response) =>{ //Get games of a certain age interval
    try{
        const { age }= req.params;
        const numericAge = Number(age);

        const games = await getGamesByMinimumAge(numericAge);

        return res.status(200).json(games);
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}
export const getGameMultiplayer = async (req: express.Request, res: express.Response) =>{ //Get multiplayer games
    try{

        const games = await getMultiplayerGames();

        return res.status(200).json(games);
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}
export const getGameSingleplayer = async (req: express.Request, res: express.Response) =>{ //Get singleplayer games
    try{

        const games = await getSingleplayerGames();

        return res.status(200).json(games);
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}
export const getGamePrevDate = async (req: express.Request, res: express.Response) => { //Get games whose release date is previous to the date passed as parameter
    try {
        const { date } = req.body;
        const queryDate = new Date(date);
        const games = await getGamesFromDateBackwards(queryDate);
        return res.status(200).json(games);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getGamePostDate = async (req: express.Request, res: express.Response) => { //Get games whose release date is after the date passed as parameter
    try {
        const { date } = req.body;
        const queryDate = new Date(date);
        const games = await getGamesFromDateOnwards(queryDate);

        return res.status(200).json(games);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};