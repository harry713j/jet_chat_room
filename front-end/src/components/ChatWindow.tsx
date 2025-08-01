import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Group, Message } from "@/types/types";
import { useUser } from "@/context/UserContext";
import { Loader } from "lucide-react";

type Props = {
  messages: Message[];
  room: Group;
  isLoading: boolean;
};

// handling the messages from client sockets, also making the user online status
// when user visit the /chat location then the user status change to connected and online,
// for every group/room listen to the online_user event
// for every group listen to the new_message event

export function ChatWindow({ messages, room, isLoading }: Props) {
  const { user } = useUser();
  const [text, setText] = useState("");

  // const handleSend = () => {
  //   if (text.trim()) {
  //     onSend(text);
  //     setText("");
  //   }
  // };

  if (!room)
    return <div className="p-4">Select a chat to start messaging.</div>;

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <Loader className="w-24 h-24 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="font-bold text-lg">
        {room.isGroup
          ? room.groupName
          : room.members.find((m: any) => m.username !== user.username)
              .fullName}
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="bg-muted px-3 py-2 rounded-md w-fit max-w-[80%]"
              >
                <p className="text-sm">{msg.sender.username}</p>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="flex p-4 gap-2 border-t">
        <Input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter") handleSend();
          // }}
        />
        {/* <Button onClick={handleSend}>Send</Button> */}
      </div>
    </Card>
  );
}
