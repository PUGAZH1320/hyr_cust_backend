import { z } from "zod";

export const userValidation = {
  create: {
    body: z.object({
      accountName: z
        .string()
        .min(3, "Account name must be at least 3 characters")
        .max(255, "Account name must not exceed 255 characters"),
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
    }),
  },
  update: {
    body: z.object({
      accountName: z
        .string()
        .min(3, "Account name must be at least 3 characters")
        .max(255, "Account name must not exceed 255 characters")
        .optional(),
      email: z.string().email("Invalid email format").optional(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
    }),
  },
};

