import { Router } from "express";
import profileController from "../controllers/profile.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate-request.middleware.js";
import { authValidation } from "../validators/auth.validator.js";

const router = Router();

// All profile routes require authentication
router.get("/", authenticateToken, profileController.getProfile);

router.post(
  "/change-phone",
  authenticateToken,
  validateRequest(authValidation.changePhone),
  profileController.changePhone
);

router.post(
  "/verify-phone",
  authenticateToken,
  validateRequest(authValidation.verifyPhone),
  profileController.verifyPhone
);

export default router;

