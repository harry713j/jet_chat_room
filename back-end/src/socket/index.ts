import { Socket } from "socket.io"
import { io } from "../app.js"

io.on("connection", (socket: Socket) => { // this socket is client socket
    // show if someone is joined
    socket.on("join", (nickname: string) => {
        console.log(`${nickname} is joined`)
        socket.broadcast.emit("message-payload", {
            type: "system", text: `${nickname} has joined the chat`, time: new Date().toLocaleTimeString()
        })
    })

    // retrieve the user message
    socket.on("user-message", ({nickname, text }: {nickname: string, text: string}) => {
        const payload = {
            type: "chat", nickname, text, time: new Date().toLocaleTimeString()
        }
        // emit the message data to all user
        io.emit("message-payload", payload)
    })

})