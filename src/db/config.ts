import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { IConfig, IDatabaseConfig } from "../interfaces/database-config.interface.js";
import { IEnvironment } from "../types/environment.js";

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const config: IConfig = {
  development: {
    postgres: {
      options: {
        host: dbHost,
        port: parseInt(dbPort as string),
        database: dbName,
        username: dbUser,
        password: dbPassword,
        dialect: "postgres",
        logging: false,
      },
    },
  },
  production: {
    postgres: {
      options: {
        host: dbHost,
        port: parseInt(dbPort as string),
        database: dbName,
        username: dbUser,
        password: dbPassword,
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
        logging: false,
      },
    },
  },
  test: {
    postgres: {
      options: {
        host: dbHost,
        port: parseInt(dbPort as string),
        database: dbName,
        username: dbUser,
        password: dbPassword,
        dialect: "postgres",
        logging: false,
      },
    },
  },
};

const env = (process.env.NODE_ENV as IEnvironment) || "development";
const dbConfig = config[env].postgres.options;

export const sequelize = new Sequelize(
  dbConfig.database!,
  dbConfig.username!,
  dbConfig.password!,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: dbConfig.dialectOptions,
  }
);

export default sequelize;

