import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

export class TempPhone extends Model {
  public user_id!: number;
  public ph_no!: string;
  public otp!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

TempPhone.init(
  {
    user_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    ph_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    otp: {
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
    tableName: "temp_phone",
    paranoid: true, // Enables soft deletes
    timestamps: true,
  }
);
