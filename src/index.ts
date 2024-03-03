import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import router from "./router";
import mongoose from "mongoose";

const app = express();

app.use(cors({
    credentials: true,
    origin: true 
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT || 8000; //Run the API on localhost 8000 by default or if it's in a docker container, depending on the environmental variable PORT

server.listen(port, () => {
    console.log(`Server running on localhost ${port}`);
});

const MONGO_URL = "mongodb+srv://lucas:lucas@cluster0.mjjxpge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; //MongoDB database URL

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL); //Connect mongoose to the MongoDB database
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use("/", router()); //Create the router of the app
