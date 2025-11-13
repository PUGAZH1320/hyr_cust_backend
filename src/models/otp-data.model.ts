import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

export class OtpData extends Model {
  public id!: number;
  public user_id!: number;
  public otp_value!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

OtpData.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    otp_value: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "otp_data",
    paranoid: true, // Enables soft deletes
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

