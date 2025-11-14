import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate-request.middleware.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authValidation } from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/send-otp",
  validateRequest(authValidation.sendOtp),
  authController.sendOtp
);

router.post(
  "/verify-otp",
  validateRequest(authValidation.verifyOtp),
  authController.verifyOtp
);

router.put(
  "/update-fcm",
  authenticateToken,
  validateRequest(authValidation.updateFcm),
  authController.updateFcm
);

export default router;

