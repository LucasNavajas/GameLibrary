import mongoose, { Schema, Document } from "mongoose";

const LibrarySchema = new mongoose.Schema({
    games: [{ type: Schema.Types.ObjectId, ref: 'Game' }] 
});

export interface ILibrary extends Document {
    games: mongoose.Types.Array<Schema.Types.ObjectId>;
}

export const LibraryModel = mongoose.model<ILibrary>("Library", LibrarySchema);
