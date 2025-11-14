import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import {
  IConfig,
  IDatabaseConfig,
} from "../interfaces/database-config.interface.js";
import { IEnvironment } from "../types/environment.js";
import { logger } from "../utils/logger.js";

dotenv.config();

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || "3306";
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";

const config: IConfig = {
  development: {
    mysql: {
      options: {
        host: dbHost,
        port: parseInt(dbPort as string),
        database: dbName,
        username: dbUser,
        password: dbPassword,
        dialect: "mysql",
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        dialectOptions: {
          connectTimeout: 60000,
        },
      },
    },
  },
  production: {
    mysql: {
      options: {
        host: dbHost,
        port: parseInt(dbPort as string),
        database: dbName,
        username: dbUser,
        password: dbPassword,
        dialect: "mysql",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: false,
        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000,
        },
      },
    },
  },
  test: {
    mysql: {
      options: {
        host: dbHost,
        port: parseInt(dbPort as string),
        database: dbName,
        username: dbUser,
        password: dbPassword,
        dialect: "mysql",
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      },
    },
  },
};

const env = (process.env.NODE_ENV as IEnvironment) || "development";
const dbConfig = config[env].mysql.options;

// Custom logging function for database queries
const dbLogger = (sql: string, timing?: number) => {
  logger.info(`[DB Query] ${sql}${timing ? ` (${timing}ms)` : ""}`);
};

// Enable logging in development, disable in production
const enableQueryLogging =
  env === "development" || process.env.DB_QUERY_LOGGING === "true";

export const sequelize = new Sequelize(
  dbConfig.database!,
  dbConfig.username!,
  dbConfig.password!,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: enableQueryLogging ? dbLogger : false,
    dialectOptions: dbConfig.dialectOptions,
    pool: {
      ...dbConfig.pool,
      // Log pool validation
      validate: (connection: any) => {
        logger.debug(`[DB Pool] Validating connection`);
        return true;
      },
    },
  }
);

// Log connection attempt
logger.info(
  `[DB Connection] Attempting to connect to MySQL database: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`
);

// Add connection event listeners using Sequelize hooks
sequelize.addHook("beforeConnect", (config: any) => {
  logger.info(
    `[DB Connection] Initiating connection to ${config.host}:${config.port}/${config.database}`
  );
});

sequelize.addHook("afterConnect", (connection: any, config: any) => {
  logger.info(
    `[DB Connection] Successfully established connection to ${config.host}:${config.port}/${config.database}`
  );
});

sequelize.addHook("beforeDisconnect", (connection: any) => {
  logger.debug(`[DB Connection] Disconnecting from database`);
});

sequelize.addHook("afterDisconnect", (connection: any) => {
  logger.debug(`[DB Connection] Disconnected from database`);
});

// Test connection on initialization
sequelize
  .authenticate()
  .then(() => {
    logger.info(
      `[DB Connection] ✓ Database connection authenticated successfully: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`
    );
  })
  .catch((error) => {
    logger.error(
      `[DB Connection] ✗ Failed to authenticate database connection: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`,
      error
    );
  });

export default sequelize;
