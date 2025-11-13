import { TempPhone } from "../models/temp-phone.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { Transaction } from "sequelize";
import { sequelize } from "../db/config.js";

export class TempPhoneService {
  async create(
    data: Partial<TempPhone>,
    transaction?: Transaction
  ): Promise<TempPhone> {
    return await TempPhone.create(data, { transaction });
  }

  async findByUserId(user_id: number): Promise<TempPhone> {
    const tempPhone = await TempPhone.findOne({
      where: {
        user_id,
        deletedAt: null,
      },
    });

    if (!tempPhone) {
      throw new NotFoundError(`Temp phone with user_id ${user_id} not found`);
    }

    return tempPhone;
  }

  async findByPhoneNumber(ph_no: string): Promise<TempPhone | null> {
    return await TempPhone.findOne({
      where: {
        ph_no,
        deletedAt: null,
      },
    });
  }

  async findAll(): Promise<TempPhone[]> {
    return await TempPhone.findAll({
      where: {
        deletedAt: null,
      },
    });
  }

  async update(user_id: number, data: Partial<TempPhone>): Promise<TempPhone> {
    const transaction = await sequelize.transaction();

    try {
      const tempPhone = await this.findByUserId(user_id);
      await tempPhone.update(data, { transaction });
      await transaction.commit();
      return tempPhone;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(user_id: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const tempPhone = await this.findByUserId(user_id);
      await tempPhone.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async verifyOtp(user_id: number, otp: string): Promise<boolean> {
    const tempPhone = await this.findByUserId(user_id);
    return tempPhone.otp === otp;
  }
}
