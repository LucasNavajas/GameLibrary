import express from "express";

import { login, logout, register } from "../controllers/authentication";

export default (router: express.Router) =>{ //Router for login and registration
    router.post("/auth/register", register);
    router.post("/auth/login", login);
    router.post("/auth/logout", logout)
}