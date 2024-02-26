import mongoose, {Schema, Document} from "mongoose";

const GenreSchema = new mongoose.Schema({
    name: {type: String, required: true}
});

export interface IGenre extends Document{
    name: string;
}

export const GenreModel = mongoose.model<IGenre>("Genre", GenreSchema);

export const GetGenreById = (id: string) => GenreModel.findById(id);
export const CreateGenre = (name : string) => {return new GenreModel({ name }).save();}
export const DeleteGenreById = (id: string) => GenreModel.findOneAndDelete({_id: id});
export const UpdateGenreById = (id: string, values: Record<string, any>) => GenreModel.findByIdAndUpdate(id, values);