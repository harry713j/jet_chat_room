import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar, ChatWindow } from "@/components";
import { useEffect, useState } from "react";
import type { ActiveChat, Group, Message } from "@/types/types";
import { useSocket } from "@/context/SocketContext";
import axios from "axios";
import { toast } from "sonner";

export function SidebarLayout() {
  const [currentRoom, setCurrentRoom] = useState<Group>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeRooms, setActiveRooms] = useState<ActiveChat[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    axios
      .get(`${URL}/users/active-chats`)
      .then((res) => setActiveRooms(res.data.activeChats))
      .catch(() => toast.error("Couldn't get user active chats"));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.connect();

    // join users all groups
    const groupIds = activeRooms.map((room: ActiveChat) => {
      return room.type === "private" ? room.recieverId : room.groupId;
    });

    socket.emit("join_group", { groupIds });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // recieve new message new message
    const onNewMessage = (message: Message) => {
      if (message.chatgroupId === currentRoom?.groupId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    function onUserOnline({ userId }: { userId: string }) {
      console.log(`User online: ${userId}`);
      // Update UI or state if needed
    }

    function onUserOffline({ userId }: { userId: string }) {
      console.log(`User offline: ${userId}`);
      // Update UI or state if needed
    }

    function onMessageSeen({ messageId, userId }: any) {
      console.log(`Message ${messageId} seen by ${userId}`);
      // Update message UI if needed
    }

    function onTyping({ userId }: any) {
      console.log(`User ${userId} is typing...`);
      // Show typing indicator
    }

    function onStopTyping({ userId }: any) {
      console.log(`User ${userId} stopped typing`);
      // Hide typing indicator
    }

    socket.on("new_message", onNewMessage);
    socket.on("user_online", onUserOnline);
    socket.on("user_offline", onUserOffline);
    socket.on("message_seen", onMessageSeen);
    socket.on("user_typing", onTyping);
    socket.on("user_stop_typing", onStopTyping);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("user_online", onUserOnline);
      socket.off("user_offline", onUserOffline);
      socket.off("message_seen", onMessageSeen);
      socket.off("user_typing", onTyping);
      socket.off("user_stop_typing", onStopTyping);
    };
  }, [currentRoom?.groupId]);

  const handleRoomSelect = (room: Group, messages: Message[]) => {
    setCurrentRoom(room);
    setMessages(messages);
  };

  return (
    <SidebarProvider>
      <UserSidebar
        onRoomSelect={handleRoomSelect}
        setIsLoading={setIsLoading}
      />
      <div>
        <SidebarTrigger />
        <ChatWindow
          room={currentRoom}
          messages={messages}
          isLoading={isLoading}
        />
      </div>
    </SidebarProvider>
  );
}
