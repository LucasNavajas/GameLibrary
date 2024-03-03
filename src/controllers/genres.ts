import express from "express";

import { GetGenreById, CreateGenre, DeleteGenreById, GetGenres } from "../db/genres";
//Generic operations related to genres
export const getAllGenres = async (req: express.Request, res: express.Response) =>{
    try{
        const genres = await GetGenres();

        return res.status(200).json(genres);
    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const createGenre = async (req: express.Request, res: express.Response) => {
    const { name } = req.body;

    if(!name){
        return res.status(400).json({ message: "Missing name" });
    }

    try {
        const genre = await CreateGenre(name);
        return res.status(201).json(genre);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating new genre" });
    }
}

export const getGenre = async (req: express.Request, res:express.Response) =>{
    try{
        const { id } = req.params;

        const genre = await GetGenreById(id);

        return res.status(200).json(genre);
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}

export const deleteGenre = async (req: express.Request, res: express.Response) =>{
    try{
        const { id } = req.params;

        const genre = await DeleteGenreById(id);

        return res.status(200).json(genre);
    } catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}