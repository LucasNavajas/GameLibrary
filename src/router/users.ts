import express from "express";

import { getAllUsers, deleteUser, updateUser, updateUserPreferences, getRecommendations } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
    router.get("/users", isAuthenticated, getAllUsers);
    router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
    router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
    router.patch('/users/:id/preferences', isAuthenticated, isOwner, updateUserPreferences);
    router.get('/users/:id/recommendations',isAuthenticated, isOwner, getRecommendations);
    
}