import { UserDocument } from "./schema";
import "express";

declare module "express" {
  interface Request {
    user?: UserDocument | null;
  }
}
