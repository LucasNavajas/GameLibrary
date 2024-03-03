import mongoose, {Schema, Document} from "mongoose";

const GenreSchema = new mongoose.Schema({ //Definition of genre class, it's just a name but it had to be a new instance for parameterization
    name: {type: String, required: true, unique:true, trim: true}
});

export interface IGenre extends Document{ //Definition of the interface
    name: string;
}

export const GenreModel = mongoose.model<IGenre>("Genre", GenreSchema); //GenreModel for CRUD operations with the different functions used in the controller.
export const GetGenres = () => GenreModel.find();
export const GetGenreById = (id: string) => GenreModel.findById(id);
export const CreateGenre = async (name : string) => { 
    const genre = await new GenreModel({ name }).save();
    return genre.toObject();
}
export const DeleteGenreById = (id: string) => GenreModel.findOneAndDelete({_id: id});
export const UpdateGenreById = (id: string, values: Record<string, any>) => GenreModel.findByIdAndUpdate(id, values);