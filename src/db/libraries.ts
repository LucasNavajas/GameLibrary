import mongoose, { Schema, Document } from "mongoose";

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