import { useEffect, useState } from "react"
import { socket } from "../socket"
import {Chat, Notification} from "../components"
import { Link } from "react-router"

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
        <div className="relative w-full h-screen px-28 py-12 flex justify-center items-center">
            <div className="w-full h-full flex flex-col items-center ">
                <div className="px-12 py-6"></div>
            <div className="fixed top-0 w-full shadow px-12 py-6 flex items-center justify-between bg-linear-to-tr from-pink-200 to-red-50 border-b border-red-700 ">
                <Link to={'/'} className=" text-lg font-medium text-blue-600 ">Back</Link>
                <div className="self-center flex items-center space-x-2">
                    <h2 className="text-3xl font-semibold text-slate-700 capitalize">Chat room</h2>
                    <span className={`w-5 h-5 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
                </div>
                <div></div>
            </div>
            
            <div className="flex-1 w-full flex flex-col space-y-2 ">
             {
                messageDetails.map((msg, index) => {
                    if (msg.type === "system") {
                        return <Notification key={index} text={msg.text} time={msg.time} />
                    }

                        return <Chat key={index} nickname={msg.nickname} text={msg.text} time={msg.time} />
                })
             }
            </div>

            <div className=" w-4/5 flex items-center justify-center space-x-6">
                <input 
                    type="text" 
                    placeholder="Type your message...."
                    value={inputMessage} 
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key == 'Enter' && sendMessage()} 
                    className="w-4/5 h-[4rem] px-6 py-2 rounded-md  border border-slate-200 outline-none transition text-lg font-medium text-slate-700 shadow-xl placeholder:text-lg placeholder:opacity-70 focus:border-red-400 "
                />
                <button 
                    onClick={sendMessage}
                    className="w-1/12 h-[4rem] px-4 py-1.5 text-lg font-semibold text-slate-100 rounded-md shadow-md transition cursor-pointer capitalize bg-red-500 hover:bg-red-600 "
                >Send</button>
            </div>
            </div>
        </div>
    )
}