import express from "express";

import { createGenre, deleteGenre, getAllGenres, getGenre } from "../controllers/genres"; 


export default(router: express.Router) => {
    router.post("/genres", createGenre);
    router.delete("/genres/:id", deleteGenre);
    router.get("/genres/:id", getGenre);
    router.get("/genres", getAllGenres)
} 