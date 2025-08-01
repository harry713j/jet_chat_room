import { Schema, model } from "mongoose";
import { ChatGroupSchema } from "../types/schema.js";

const chatgroupSchema = new Schema<ChatGroupSchema>(
  {
    isGroup: {
      type: Boolean,
      default: true,
    },
    groupName: {
      type: String,
      maxlength: 25,
      minlength: 3,
      trim: true,
      required: function () {
        return this.isGroup === true;
      },
    },
    groupId: {
      type: String,
      required: [true, "Group Id is required"],
      index: true,
      unique: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Chatgroup = model<ChatGroupSchema>("Chatgroup", chatgroupSchema);
