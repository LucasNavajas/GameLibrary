import express from "express";

import authentication from "./authentication";
import users from "./users";
import libraries from "./libraries";

const router = express.Router();

export default (): express.Router =>{
    authentication(router);
    users(router);
    libraries(router);

    return router;
}