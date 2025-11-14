import { Application } from "express";
import { languageMiddleware } from "../middleware/language-middleware.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import authController from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const routes = (app: Application) => {
  app.use(languageMiddleware);

  // Register routes here
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/v1/profile", profileRoutes);

  // Logout route at /api/v1/log-out
  app.post("/api/v1/log-out", authenticateToken, authController.logout);

  // Health check route
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
    });
  });
};

export default routes;
