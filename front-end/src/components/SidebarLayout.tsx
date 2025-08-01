import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar, ChatWindow } from "@/components";
import { useState } from "react";
import type { Group, Message } from "@/types/types";

// start the connections to the socket if the user at /chat and authenticated and change the status of the user

export function SidebarLayout() {
  const [currentRoom, setCurrentRoom] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
