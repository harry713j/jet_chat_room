/** Declaration types of all the database schemas */
import { Document } from "mongoose";

interface ChatGroupSchema extends Document {
  groupName: string;
  groupId: string; // randomly generated
  admin: UserDocument;
  members: UserDocument[];
  isGroup: boolean;
}

interface UserSchema {
  fullName: string;
  username: string;
  email: string;
  password?: string;
  groups: Array<ChatGroupSchema>;
  refreshToken?: string;
  onlineStatus: boolean;
  socketId?: string;
}

interface UserMethods {
  // functions
  generateRefreshToken: () => string;
  generateAccessToken: () => string;
}

type UserDocument = Document & UserSchema & UserMethods;

interface MessageSchema extends Document {
  chatgroupId: ChatGroupSchema;
  sender: UserDocument;
  content: string;
  contentType: "text" | "image" | "file";
  seenBy: Array<UserDocument>;
  createdAt: Date;
}
