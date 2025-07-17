import { Schema, model } from "mongoose";
import { MessageSchema } from "../types/schema.js";


const messageSchema = new Schema<MessageSchema>({
    chatgroupId: {
        type: Schema.Types.ObjectId,
        ref: "Chatgroup",
        required: true,
        index: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentType:{
        type: String,
        enum: ["text", "image", "file"],
        default: "text"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    seenBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {timestamps: true})


export const Message = model("Message", messageSchema)