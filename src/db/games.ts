import mongoose, {Schema, Document} from "mongoose";
import { IGenre } from "./genres";

const GameSchema = new mongoose.Schema({
    title: {type: String, required: true},
    genre: {type: Schema.Types.ObjectId, ref: 'Genre', required: true},
    releaseDate: {type: Date, required: true},
    description: {type: String, required: true},
    multiplayer: {type: Boolean, required: true},
    picture: { type: String }
});

export interface IGame extends Document {
    title: string;
    genre: IGenre['_id'];
    releaseDate: Date;
    description: string;
    multiplayer: boolean;
    picture: string;
}

export const GameModel = mongoose.model<IGame>("Game", GameSchema);