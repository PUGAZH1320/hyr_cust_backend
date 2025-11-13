import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

export class User extends Model {
  public id!: number;
  public countryCode!: string;
  public phoneNumber!: string;
  public fullName!: string;
  public Gender!: number;
  public isBusinessUser!: number;
  public isActive!: number;
  public emailID!: string;
  public rideOTP!: string;
  public isVerified!: number;
  public referalCode?: string;
  public referedBy?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    Gender: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isBusinessUser: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    emailID: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    rideOTP: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    referalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    referedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "user",
    paranoid: true, // Enables soft deletes
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

