import {
  groupSchema,
  messageSchema,
  userSchema,
} from "@/schema/chatgroupSchema";
import type { Socket } from "socket.io-client";
import { z } from "zod";

type Group = z.infer<typeof groupSchema>;
type User = z.infer<typeof userSchema>;
type Message = z.infer<typeof messageSchema>;

type UserContextType = {
  user?: User;
  isLoading: boolean;
};

type SocketContextType = {
  socket: Socket | null;
};

type UserOption = {
  userId: string;
  username: string;
  fullName: string;
};

type GroupOption = {
  groupName: string;
  groupId: string;
};

type SearchResult = {
  users: UserOption[];
  groups: GroupOption[];
};

type ActiveGroup = {
  type: "group";
  groupId: string;
  groupName: string;
  memberCount: number;
};

type ActiveReciever = {
  type: "private";
  recieverId: string;
  fullName: string;
  username: string;
  onlineStatus: boolean;
};

type ActiveChat = ActiveGroup | ActiveReciever;
