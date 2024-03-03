import mongoose, { Schema, Document } from "mongoose";
import { GameModel } from "./games";
const ObjectId = mongoose.Types.ObjectId;

const LibrarySchema = new mongoose.Schema({ //Definition of library schema for the db
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }] 
});

export interface ILibrary extends Document { //Definition of the interface for type safety
    games: mongoose.Types.Array<Schema.Types.ObjectId>;
}

export const LibraryModel = mongoose.model<ILibrary>("Library", LibrarySchema); //Library Model for CRUD operations

export const getGames = async (libraryId : string): Promise<mongoose.Types.Array<Schema.Types.ObjectId>> => { //Get all games ids stored in the library
    try{
        const library = await LibraryModel.findById(libraryId);

        if(!library){
            return [] as mongoose.Types.Array<Schema.Types.ObjectId>;
        }

        const gameIds = library.games;

        return gameIds;
        

    } catch(error){
        console.log(error);
    }
};

export const addGame = async (libraryId: string, gameId: string): Promise<void> => { //Add a game to the library through its id
    try {
        const library = await LibraryModel.findById(libraryId);

        if (!library) {
            console.log("Library not found");
            return;
        }

        const game = await GameModel.findById(gameId);

        if (!game) {
            console.log("Game not found");
            return;
        }
        const gameIdString = gameId.toString();

        if (!library.games.some(id => id.toString() === gameIdString)) {

            library.games.push(game._id); 
            await library.save();
            console.log("Game added to library successfully");
        } else {
            console.log("Game already exists in library");
        }

    } catch (error) {
        console.log(error);
    }
};

export const removeGame = async (libraryId: string, gameId: string): Promise<void> => { //Remove a game from the library through its id
    try {
        const library = await LibraryModel.findById(libraryId);

        if (!library) {
            console.log("Library not found");
            return;
        }

        const gameIndex = library.games.findIndex(id => id.toString() === gameId);

        if (gameIndex === -1) {
            console.log("Game not found in library");
            return;
        }

        library.games.splice(gameIndex, 1);

        await library.save();
        console.log("Game removed from library successfully");

    } catch (error) {
        console.error("Error removing game from library:", error);
    }
};

