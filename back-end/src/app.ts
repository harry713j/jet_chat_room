import express from "express";
import {createServer} from "http"
import {Server} from "socket.io"
import cors from 'cors'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { visitedEndpointsLogger } from "./utils/logger.js";

dotenv.config()

import { ALLOWED_CLIENT } from "./constants.js";
import userRouter from "./routes/user.route.js";
import chatgroupRouter from "./routes/chatgroup.route.js"
import messageRouter from "./routes/message.route.js"


const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ALLOWED_CLIENT,
        credentials: true
    }
})

app.use(cors({
    origin: ALLOWED_CLIENT,
    credentials: true // allow cookies
}))

app.use(express.json({}))
app.use(cookieParser())
// for logging the requested endpoints 
app.use(visitedEndpointsLogger)

app.use("/api/v1/users", userRouter)
app.use("/api/vi/chat-group", chatgroupRouter)
app.use("/api/v1/messages", messageRouter)

export{
    httpServer, io
}