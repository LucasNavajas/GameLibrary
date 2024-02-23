import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { createPool } from "mysql2/promise";

const app = express();

app.use(cors({
    credentials: true,
    origin: true 
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gamelibrary',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const server = http.createServer(app);

server.listen(8000, () => {
    console.log("Server running on localhost 8000");
});
