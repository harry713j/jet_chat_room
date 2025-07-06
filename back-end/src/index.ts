import express from "express";
import {createServer} from "http"
import {Server} from "socket.io"
import cors from 'cors'

import { PORT, ALLOWED_CLIENT } from "./constants.js";

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
    origin: ALLOWED_CLIENT
}))

io.on("connection", (socket) => { // this socket is client socket
    // show if someone is joined
    socket.on("join", (nickname) => {
        console.log(`${nickname} is joined`)
        socket.broadcast.emit("message-payload", {
            type: "system", text: `${nickname} has joined the chat`, time: new Date().toLocaleTimeString()
        })
    })

    // retrieve the user message
    socket.on("user-message", ({nickname, text }) => {
        const payload = {
            type: "chat", nickname, text, time: new Date().toLocaleTimeString()
        }
        // emit the message data to all user
        io.emit("message-payload", payload)
    })

})

// for REST + Socket to work together, instead of app.listen() we should use httpServer.listen()
// app.listen() : start only the API server
// httpServer.listen() : start API server as well as attached WebSocket
httpServer.listen(PORT, () => {
    console.log("🚀 Server started on Port ", PORT)
})