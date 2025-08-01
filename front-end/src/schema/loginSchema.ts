import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .nonempty("Username or Email is required")
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
        /^[a-z0-9@#_]{4,20}$/.test(val),
      {
        message: "Must be a valid username or email",
      }
    ),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
