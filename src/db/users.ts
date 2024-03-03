import mongoose, {Schema, Document} from "mongoose";
import { ILibrary, LibraryModel } from "./libraries";

const UserSchema = new mongoose.Schema({ //Definition of the UserSchema in the MongoDB database
    username: {type: String, required: true},
    email: {type: String, required: true},
    authentication: {
        password:{type:String, required : true, select:false},
        salt: {type: String, select: false}, //Salt used by the helper to secure the password of the user
        sessionToken: {type: String, select:false} //Session Token for users login
   },
   library: { type: Schema.Types.ObjectId, ref: 'Library' }, //Each user has only one library created when the user registers
   preferredGenres: [{ type: String }],
    preferredAgeRange: { 
        min: { type: Number, min: 0 },
        max: { type: Number, max: 18 }
    }
});

export interface IUser extends Document {  //Definition of the interface to provide type information
    username: string;
    email: string;
    authentication: {
        password: string;
        salt: string;
        sessionToken: string;
    };
    library: ILibrary['_id'];
    preferredGenres: string[];
    preferredAgeRange?: {
        min: number;
        max: number;
    };
}

export const UserModel = mongoose.model("User", UserSchema); //Creation of the model for the schema, allowing CRUD operations on User documents in the db.

//Different methods using UserModel for prior implementation in the controller
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    "authentication.sessionToken": sessionToken,
});
export const getUserById = (id: string) => UserModel.findById(id).populate('library');
export const createUser = async (values: Record<string, any>) => { // Creation of an instance of user, an instance of library and linking of library with user
    const user = new UserModel(values);
    await user.save();

    const library = new LibraryModel({ user: user._id });
    await library.save(); 

    user.library = library._id; 
    await user.save(); 

    return user.toObject();
};
export const deleteUserById = async (userId: string) => { //When you delete an user you delete the library linked to it too
    await UserModel.findByIdAndDelete(userId);

    await LibraryModel.deleteOne({ user: userId });
};
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

