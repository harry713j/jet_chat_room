import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_URL;

const socket = io(URL, {
    autoConnect: false // By default, the Socket.IO client opens a connection to the server right away, this will prevent this
})

export { socket }