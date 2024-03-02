import express from "express";
import mongoose from "mongoose";
import { deleteUserById, getUserById, getUsers, UserModel } from "../db/users";
import { GameModel, IGame } from '../db/games';
import { GenreModel } from "../db/genres";
import { ILibrary } from "../db/libraries";

export const getAllUsers = async (req: express.Request, res: express.Response) =>{
    try{
        const users = await getUsers();

        return res.status(200).json(users);
    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) =>{
    try{
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.json(deletedUser);
    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) =>{
    try{
        const { id } = req.params;
        const { username } = req.body;

        if(!username){
            return res.sendStatus(400);
        }
        
        const user = await getUserById(id);

        user.username = username;
        await user.save();

        return res.status(200).json(user).end();
    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUserPreferences = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params; 
        const { preferredGenres, preferredAgeRange } = req.body; 

        const updatedUser = await UserModel.findByIdAndUpdate(id, {
            $set: {
                preferredGenres,
                preferredAgeRange
            }
        }, { new: true }); 

        if (!updatedUser) {
            return res.status(404).send("User not found.");
        }

        return res.json(updatedUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send("An error occurred while updating user preferences.");
    }
};

export const getRecommendations = async (req: express.Request, res: express.Response) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId).populate({
            path: 'library',
            populate: { path: 'games' }
          });
          

        if (!user) {
            return res.status(404).send('User not found');
        }
        const preferredGenres = user.preferredGenres;
        const userLibraryGameIds = (user.library as any).games.map((game: IGame) => game._id);
        const genres = await GenreModel.find({ name: { $in: preferredGenres } });
        const genreIds = genres.map(genre => genre._id);
        const recommendedGames = await GameModel.aggregate([
            {
                $match: {
                    genre: { $in: genreIds },
                }
            },
            {
                $lookup: {
                    from: GenreModel.collection.name,
                    localField: 'genre',
                    foreignField: '_id',
                    as: 'genreData'
                }
            },
            { $unwind: '$genreData' },
            {
                $match: {
                    '_id': { 
                        $nin: userLibraryGameIds.map((id: string | mongoose.Types.ObjectId) => 
                        typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id) 
                    }
                }
            }
        ]);
        

        return res.json(recommendedGames);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching recommendations');
    }
};