import mongoose, {Schema, Document} from "mongoose";
import { ILibrary, LibraryModel } from "./libraries";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    authentication: {
        password:{type:String, required : true, select:false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select:false}
   },
   library: { type: Schema.Types.ObjectId, ref: 'Library' }
});

export interface IUser extends Document {
    username: string;
    email: string;
    authentication: {
        password: string;
        salt: string;
        sessionToken: string;
    };
    library: ILibrary['_id'];
}

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    "authentication.sessionToken": sessionToken,
});
export const getUserById = (id: string) => UserModel.findById(id).populate('library');
export const createUser = async (values: Record<string, any>) => {
    const user = new UserModel(values);
    await user.save();

    const library = new LibraryModel({ user: user._id });
    await library.save(); 

    user.library = library._id; 
    await user.save(); 

    return user.toObject();
};
export const deleteUserById = async (userId: string) => {
    await UserModel.findByIdAndDelete(userId);

    await LibraryModel.deleteOne({ user: userId });
};
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);