import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { validateRequest } from "../middleware/validate-request.middleware.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { userValidation } from "../validators/user.validator.js";

const router = Router();

router.post(
  "/",
  validateRequest(userValidation.create),
  authenticateToken,
  userController.create
);

router.get("/", authenticateToken, userController.findAll);

router.get("/:id", authenticateToken, userController.findById);

router.put(
  "/:id",
  validateRequest(userValidation.update),
  authenticateToken,
  userController.update
);

router.delete("/:id", authenticateToken, userController.delete);

export default router;

