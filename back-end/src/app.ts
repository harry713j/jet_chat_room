import express, { NextFunction, Request, Response } from "express";
import {createServer} from "http"
import {Server} from "socket.io"
import cors from 'cors'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config()

import { ALLOWED_CLIENT } from "./constants.js";

const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, {
    // for front-end running at different port
    cors: {
        origin: ALLOWED_CLIENT,
        methods: ["GET", "POST"],
        credentials: true
    }
})


app.use(cors({
    origin: ALLOWED_CLIENT,
    credentials: true // allow cookies
}))

app.use(express.json({}))
app.use(cookieParser())

// for testing purpose
app.use((req: Request, _: Response, next: NextFunction) => {
    console.log("Reqested Url: ", req.originalUrl, ": time : ", new Date().toLocaleDateString() + ":" + new Date().toLocaleTimeString())
    next()
})


import userRouter from "./routes/user.route.js";
app.use("/api/v1/users", userRouter)

export{
    httpServer, io
}