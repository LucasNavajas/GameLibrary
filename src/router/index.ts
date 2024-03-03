import express from "express";

import authentication from "./authentication";
import users from "./users";
import libraries from "./libraries";
import genres from "./genres";
import games from "./games";

const router = express.Router();

export default (): express.Router =>{ //Defines all the routers of the different classes
    authentication(router);
    users(router);
    libraries(router);
    genres(router);
    games(router);

    return router;
}