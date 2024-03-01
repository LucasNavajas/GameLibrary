import mongoose, { Schema, Document } from "mongoose";
import { GameModel } from "./games";
const ObjectId = mongoose.Types.ObjectId;

const LibrarySchema = new mongoose.Schema({
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }] 
});

export interface ILibrary extends Document {
    games: mongoose.Types.Array<Schema.Types.ObjectId>;
}

export const LibraryModel = mongoose.model<ILibrary>("Library", LibrarySchema);

export const getGames = async (libraryId : string): Promise<mongoose.Types.Array<Schema.Types.ObjectId>> => {
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

export const addGame = async (libraryId: string, gameId: string): Promise<void> => {
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
