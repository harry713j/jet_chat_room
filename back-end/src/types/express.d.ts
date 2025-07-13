import { UserSchema } from "./schema";
import "express"

declare module "express"{
    interface Request{
        user?: UserSchema | null
    }
}