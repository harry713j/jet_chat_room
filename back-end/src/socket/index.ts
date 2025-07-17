import { Socket } from "socket.io"
import { io } from "../app.js"
import { User } from "../models/user.model.js"
import { Message } from "../models/messages.model.js"

io.on("connection", (socket: Socket) => {
   // when user connected change users online status "offline" to online
   socket.on("join_group", ({userId, groupIds}) => {
        socket.userId = userId
        socket.join(groupIds)

        User.findByIdAndUpdate(userId, {
            onlineStatus: true,
            socketId: socket.id
        }).then(() => io.emit("user_online", {userId}))
   })
   // when user send new message fetch it and store it in db and send it to the correct chat group
   socket.on("send_message", async (payload) => {
    try {
        const {chatgroupId, senderId, content} = payload

        const newMessage = await Message.create({
            chatgroupId: chatgroupId,
            sender: senderId,
            content: content
        })

        // send it to the group or individual
        io.to(chatgroupId).emit("new_message", newMessage)

    } catch (error) {
        console.error("Error saving the message to the DB ", error)
        io.emit("error", "Unable to send the message")
    }
   })

    // Typing indicator
    socket.on("typing", ({ chatGroupId, userId }) => {
      socket.to(chatGroupId).emit("user_typing", { userId })
    })

    socket.on("stop_typing", ({ chatGroupId, userId }) => {
      socket.to(chatGroupId).emit("user_stop_typing", { userId })
    })

    // Seen message
    socket.on("seen_message", ({ chatGroupId, userId, messageId }) => {
      io.to(chatGroupId).emit("message_seen", { userId, messageId })
    })

    // Disconnect handler
    socket.on("disconnect", async () => {
      console.log("❌ Disconnected:", socket.id)

      if (!socket.userId) return

      await User.findByIdAndUpdate(socket.userId, {
        onlineStatus: false,
        socketId: null,
      })

      io.emit("user_offline", { userId: socket.userId })
    })
})