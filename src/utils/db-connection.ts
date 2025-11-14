import { sequelize } from "../db/config.js";
import { logger } from "./logger.js";

export const testDatabaseConnection = async (): Promise<void> => {
  try {
    logger.info("[DB Connection] Testing database connection...");
    await sequelize.authenticate();
    logger.info("[DB Connection] ✓ Connection test successful");
  } catch (error) {
    logger.error("[DB Connection] ✗ Connection test failed:", error);
    throw error;
  }
};

