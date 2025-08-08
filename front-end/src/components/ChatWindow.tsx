import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import type { Group, Message } from "@/types/types";
import { useUser } from "@/context/UserContext";
import { Loader } from "lucide-react";
import { useSocket } from "@/context/SocketContext";

type Props = {
  messages: Message[];
  room: Group;
  isLoading: boolean;
};

export function ChatWindow({ messages, room, isLoading }: Props) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    if (!content) {
      socket.emit("stop_typing", { chatgroupId: room?.groupId });
    } else {
      socket.emit("typing", { chatgroupId: room?.groupId });
    }
  }, [content, room?.groupId]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ userId }: any) => {
      if (userId !== user.userId && !typingUsers.includes(userId)) {
        setTypingUsers((prev) => [...prev, userId]);
      }
    };

    const handleStopTyping = ({ userId }: any) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    };

    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);

    return () => {
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
    };
  }, [typingUsers, user?.userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!socket) return;

    if (content.trim()) {
      socket.emit("send_message", {
        chatgroupId: room?.groupId,
        content,
      });
      setContent("");
    }
  };

  if (!room)
    return <div className="p-4">Select a chat room to start messaging.</div>;

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <Loader className="w-24 h-24 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="font-bold content-lg">
        {room?.isGroup
          ? room.groupName
          : room.members.find((m: any) => m.username !== user.username)
              .fullName}
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
          <div className="space-y-3">
            {messages?.map((msg, idx) => (
              <div
                key={idx}
                className="bg-muted px-3 py-2 rounded-md w-fit max-w-[80%]"
              >
                <p className="content-sm">{msg.sender.username}</p>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="flex p-4 gap-2 border-t">
        <Input
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Card>
  );
}
