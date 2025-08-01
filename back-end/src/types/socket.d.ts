import "socket.io";
import { UserDocument } from "./schema";

declare module "socket.io" {
  interface Socket {
    userId?: string;
    user?: UserDocument;
  }
}
