import mongoose, {Schema, Document} from "mongoose";
import { IGenre, GenreModel } from "./genres";

const GameSchema = new mongoose.Schema({ //Game schema definition for the database in MongoDB
    title: {type: String, required: true, unique: true}, 
    genre: {type: Schema.Types.ObjectId, ref: 'Genre', required: true}, //genre object
    releaseDate: {type: Date, required: true},
    description: {type: String, required: true},
    multiplayer: {type: Boolean, required: true},
    picture: { type: String },
    minimumAge: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: function(value: number) {
                return value > 0;
            },
            message: (props: {value: number}) => `${props.value} is not a valid minimum age! Minimum age must be greater than 0.`
        }
    }
});

export interface IGame extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    genre: IGenre['_id'];
    releaseDate: Date;
    description: string;
    multiplayer: boolean;
    picture: string;
    minimumAge: number;
}

export const GameModel = mongoose.model<IGame>("Game", GameSchema); //GameModel for CRUD 

//Definitions of methods used in game controller
export const CreateGame = async (values: Record<string, any>) => {
    const game = await new GameModel(values).save();

    return game.toObject();
};
export const getGames = () => GameModel.find();
export const getGameById = (id: string) => GameModel.findById(id);
export const updateGameById = (id: string, values: Record<string, any>) => GameModel.findByIdAndUpdate(id, values);
export const deleteGameById = (id: string) => GameModel.findByIdAndDelete(id);
export const getGamesFromDateOnwards = (date: Date) => {
    return GameModel.find({
      releaseDate: { $gte: date }
    });
};
export const getGamesFromDateBackwards = (date: Date) =>{
    return GameModel.find({
        releaseDate: {$lte: date}
    });
};
export const getGamesByGenre = (genreId: string) => GameModel.find({genre: genreId});
export const getMultiplayerGames = () => GameModel.find({multiplayer: true});
export const getSingleplayerGames = () => GameModel.find({multiplayer: false});
export const getGamesByMinimumAge = (age: number) =>{
    return GameModel.find({
        minimumAge: {$gte: age}
    });
};

export const getGamesByGenreName = async (genreName : string) => {
    const games = await GameModel.aggregate([
        {
            $lookup: {
                from: GenreModel.collection.name, 
                localField: 'genre',
                foreignField: '_id',
                as: 'genreData'
            }
        },
        {
            $match: { 'genreData.name': genreName }
        },
        {
            $unwind: '$genreData'
        }
    ]);

    return games;
};

