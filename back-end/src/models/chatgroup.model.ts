import { Schema, model } from "mongoose";
import { userSchema } from "./user.model.js";
import { ChatGroupSchema } from "../types/schema.js";

const chatgroupSchema = new Schema<ChatGroupSchema>({
    groupName: {
        type: String,
        required: [true, "Group name is required"],
        maxlength: 25,
        minlength: 3,
        trim: true,
        index: true
    },
    groupId: {
        type: String,
        required:[true, "Group Id is required"]
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    members: [userSchema]
}, {timestamps: true})


export const Chatgroup = model<ChatGroupSchema>("Chatgroup", chatgroupSchema)