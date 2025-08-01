import { z } from "zod";
import { signupSchema } from "./signupSchema";

const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB ObjectId");

export const groupNameSchema = z
  .string()
  .min(3, "chat group must contain at least 3 characters")
  .max(25, "chat group must not exceed 25 characters")
  .trim();

export const userSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    ...signupSchema.omit({ password: true }).shape,
    onlineStatus: z.boolean(),
    groups: z.array(groupSchema),
    userId: objectIdSchema,
  })
);

export const groupSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    groupName: groupNameSchema,
    groupId: z.uuid(),
    isGroup: z.boolean(),
    admin: userSchema,
    members: z.array(userSchema),
  })
);

export const createChatgroupSchema = z.object({
  groupName: groupNameSchema,
  members: z.array(userSchema),
});

export const messageSchema = z.object({
  chatgroupId: objectIdSchema,
  sender: userSchema,
  content: z.string(),
  contentType: z.enum(["text", "image", "file"]),
  createdAt: z.date(),
  seenBy: z.array(objectIdSchema),
});
