import express from "express";

import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers";

export const login = async (req: express.Request, res: express.Response) =>{
    try{
        const{ email, password } = req.body;

        if(!email || !password){
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");

        if(!user){
            return res.sendStatus(400);
        }
        //Define the expected hash of the user password. It needs to be equal to the hash in the DB
        const expectedHash = authentication(user.authentication.salt, password);

        if(user.authentication.password !== expectedHash){
            return res.sendStatus(403);
        }
        //Modify the sessionToken for this new session
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();
        //Add the cookie to save the login until logout
        res.cookie("LUCAS-AUTH", user.authentication.sessionToken, { domain: "localhost", path: "/" });

        return res.status(200).json(user).end();

    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) =>{
    try{
        const{ email, password, username } = req.body;

        if(!email || !password || !username){
            return res.sendStatus(400).json({ message: "Missing required fields" });;
        }

        const existingUser = await getUserByEmail(email);

        if(existingUser){
            return res.sendStatus(400);
        }
        //Create the user and hash its password with the authentication method defined in the helper class
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        })
        
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }

}

export const logout = async (req: express.Request, res: express.Response) => {
    try {
        // Clear the session cookie by setting its expiration date in the past
        res.cookie("LUCAS-AUTH", "", { expires: new Date(0) });

        // Send a response indicating the user has been successfully logged out
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500).json({ message: "An error occurred during the logout process." });
    }
}