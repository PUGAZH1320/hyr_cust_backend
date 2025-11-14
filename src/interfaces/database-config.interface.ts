import { Dialect, Options } from "sequelize";
import { IEnvironment } from "../types/environment.js";

export interface IDatabaseOptions {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  dialect: Dialect;
  logging?: boolean | ((sql: string) => void);
  pool?: {
    max?: number;
    min?: number;
    acquire?: number;
    idle?: number;
  };
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
    connectTimeout?: number;
  };
}

export interface IDatabaseConfig {
  mysql: {
    options: IDatabaseOptions;
  };
}

export interface IConfig {
  [key: string]: IDatabaseConfig;
}

