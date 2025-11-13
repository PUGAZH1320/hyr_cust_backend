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
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
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

