import { Application } from "express";
import { languageMiddleware } from "../middleware/language-middleware.js";
import userRoutes from "./user.routes.js";

const routes = (app: Application) => {
  app.use(languageMiddleware);

  // Register routes here
  app.use("/api/users", userRoutes);

  // Health check route
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
    });
  });
};

export default routes;

