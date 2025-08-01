import { z } from "zod";

const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(20, "Username must not exceed 20 characters")
  .refine((val) => /[a-z]/.test(val), {
    message: "Username must contain at least one lowercase letter",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Username must contain at least one digit",
  })
  .refine((val) => /[@#_]/.test(val), {
    message: "Username must contain at least one symbol (@, #, _)",
  });

const passwordSchema = z
  .string()
  .min(6, "Password must contain at least 6 characters")
  .max(20, "Password must not exceed 20 characters")
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must contain at least one digit",
  })
  .refine((val) => /[^a-zA-Z0-9]/.test(val), {
    message: "Password must contain at least one symbol",
  });

export const fullNameSchema = z
  .string()
  .min(4, "Name must be at least 4 characters")
  .max(30, "Name must not contain at most 30 characters")
  .regex(/([a-zA-Z\s]+)/, "Name only should contain alphabets")
  .trim();

export const emailSchema = z.email();

export const signupSchema = z.object({
  fullName: fullNameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  oldpassword: passwordSchema,
  newpassword: passwordSchema,
});
