import { useEffect, useState } from "react"
import { socket } from "../socket"

export default function ChatRoom(){
   const [isConnected, setIsConnected] = useState<boolean>(socket.connected)
   const [messageDetails, setMessageDetails] = useState<MessagePayload[]>([])
   const [inputMessage, setInputMessage] = useState<string>("")

   useEffect(() => {
    // opens the socket
    socket.connect();

    const nickname = localStorage.getItem("nickname")

    if(nickname){
        // send to the server
        socket.emit("join", nickname)
    }

    return () => {
         socket.disconnect()
    }
   }, [])


   useEffect(() => {
    
    const onConnect = () => {
        setIsConnected(true)
    }

    const onDisconnect = () => {
        setIsConnected(false)
    }

    const onGetMessages = (payload: MessagePayload) => {
        setMessageDetails((prev) => [...prev, payload])
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    // fetch the messages from the server
    socket.on("message-payload", onGetMessages)

    return () => {
       
        socket.off("connect", onConnect)
        socket.off("disconnect", onDisconnect)
        socket.off("message-payload", onGetMessages)
    }

   }, [])


   const sendMessage = () => {
    if(inputMessage.trim() !== ""){
        socket.emit("user-message", {
            nickname: localStorage.getItem("nickname"),
            text: inputMessage
        })
        setInputMessage("")
    }
   }

    return (
        <div>
            <h1>Chat room</h1>
            <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>

            <div>
            {
                messageDetails.map((msg, index) => {
                    if (msg.type === "system") {
                        return (
                            <p key={index} style={{ fontStyle: "italic", color: "#888", textAlign: "center" }}>
                            {msg.text} <em>{msg.time}</em>
                            </p>
                        );
                        }

                        return (
                        <p key={index} style={{ textAlign: msg.nickname === localStorage.getItem("nickname") ? "right" : "left" }}>
                            <strong>{msg.nickname}</strong> <em>{msg.time}</em>: {msg.text}
                        </p>
                    );
                })
            }
            </div>

            <div>
                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key == 'Enter' && sendMessage()} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}