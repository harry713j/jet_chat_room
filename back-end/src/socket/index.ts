import { Socket } from "socket.io";
import { io } from "../app.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/messages.model.js";
import { socketAuthMiddleware } from "../middleware/auth.middleware.js";

io.use(socketAuthMiddleware); // for allowing only logged in users

io.on("connection", (socket: Socket) => {
  // when user connected change users online status "offline" to online
  socket.on("join_group", ({ groupIds }) => {
    socket.join(groupIds);

    const userId = socket.user?.id;
    socket.userId = userId;

    User.findByIdAndUpdate(userId, {
      onlineStatus: true,
      socketId: socket.id,
    }).then(() => io.emit("user_online", { userId }));
  });
  // when user send new message fetch it and store it in db and send it to the correct chat group
  socket.on("send_message", async (payload) => {
    try {
      // handle the message payload
      const { chatgroupId, content } = payload;

      const newMessage = await Message.create({
        chatgroupId: chatgroupId,
        sender: socket.user?.id,
        content: content,
      });

      // send it to the group or individual
      io.to(chatgroupId).emit("new_message", newMessage);
    } catch (error) {
      console.error("Error saving the message to the DB ", error);
      io.emit("error", "Unable to send the message");
    }
  });

  // Typing indicator
  socket.on("typing", ({ chatGroupId }) => {
    socket.to(chatGroupId).emit("user_typing", { userId: socket.user?.id });
  });

  socket.on("stop_typing", ({ chatGroupId }) => {
    socket
      .to(chatGroupId)
      .emit("user_stop_typing", { userId: socket.user?.id });
  });

  // Seen message
  socket.on("seen_message", ({ chatGroupId, messageId }) => {
    io.to(chatGroupId).emit("message_seen", {
      userId: socket.user?.id,
      messageId,
    });
  });

  // Disconnect handler
  socket.on("disconnect", async () => {
    console.log("❌ Disconnected:", socket.id);

    if (!socket.user?.id) return;

    await User.findByIdAndUpdate(socket.user?.id, {
      onlineStatus: false,
      socketId: null,
    });

    io.emit("user_offline", { userId: socket.user?.id });
  });
});
