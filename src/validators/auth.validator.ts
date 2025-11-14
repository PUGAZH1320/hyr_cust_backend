import { z } from "zod";

export const authValidation = {
  sendOtp: {
    body: z.object({
      phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number must not exceed 20 characters"),
      countryCode: z
        .string()
        .min(1, "Country code is required")
        .max(5, "Country code must not exceed 5 characters"),
      hashKey: z.string().min(1, "Hash key is required"),
      referalId: z
        .string()
        .max(20, "Referral ID must not exceed 20 characters")
        .optional(),
    }),
  },
  verifyOtp: {
    body: z.object({
      phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number must not exceed 20 characters"),
      countryCode: z
        .string()
        .min(1, "Country code is required")
        .max(5, "Country code must not exceed 5 characters"),
      otp_value: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d+$/, "OTP must contain only digits"),
      fcm_token: z.string().max(255, "FCM token must not exceed 255 characters").optional(),
    }),
  },
  updateFcm: {
    body: z.object({
      fcm_token: z
        .string()
        .min(1, "FCM token is required")
        .max(255, "FCM token must not exceed 255 characters"),
    }),
  },
  changePhone: {
    body: z.object({
      phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number must not exceed 20 characters"),
      countryCode: z
        .string()
        .min(1, "Country code is required")
        .max(5, "Country code must not exceed 5 characters"),
    }),
  },
  verifyPhone: {
    body: z.object({
      phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number must not exceed 20 characters"),
      countryCode: z
        .string()
        .min(1, "Country code is required")
        .max(5, "Country code must not exceed 5 characters"),
      otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d+$/, "OTP must contain only digits"),
    }),
  },
};

