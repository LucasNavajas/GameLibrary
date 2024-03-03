import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";
//Methods to check if the user is logged in before making any request that would change its data (update, get users, etc)

export const isOwner = async(req: express.Request, res: express.Response, next: express.NextFunction) =>{
    //Checks if the user is owner of the objects that are going to be changed
    try{
        const { id } = req.params;
        const currentUserId = get(req, "identity._id") as string;

        if(!currentUserId){
            return res.sendStatus(403);
        }

        if(currentUserId.toString() !== id){
            return res.sendStatus(403)
        }
        
        next();

    } catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async(req: express.Request, res: express.Response, next: express.NextFunction) =>{ 
    //Check if the user is logged in by the cookie created when a user logs in and the sessionToken that it has.

    try{
        const sessionToken = req.cookies["LUCAS-AUTH"];

        if(!sessionToken){
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if(!existingUser){
            return res.sendStatus(403);
        }

        merge(req, {identity : existingUser});

        return next();
    } catch(error){
        console.log(error);
        return res.status(400);
    }
}