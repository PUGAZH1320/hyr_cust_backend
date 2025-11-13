import { OtpData } from "../models/otp-data.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { Transaction } from "sequelize";
import { sequelize } from "../db/config.js";

export class OtpDataService {
  async create(
    data: Partial<OtpData>,
    transaction?: Transaction
  ): Promise<OtpData> {
    return await OtpData.create(data, { transaction });
  }

  async findById(id: number): Promise<OtpData> {
    const otpData = await OtpData.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!otpData) {
      throw new NotFoundError(`OTP data with id ${id} not found`);
    }

    return otpData;
  }

  async findByUserId(user_id: number): Promise<OtpData> {
    const otpData = await OtpData.findOne({
      where: {
        user_id,
        deletedAt: null,
      },
    });

    if (!otpData) {
      throw new NotFoundError(`OTP data with user_id ${user_id} not found`);
    }

    return otpData;
  }

  async findAll(): Promise<OtpData[]> {
    return await OtpData.findAll({
      where: {
        deletedAt: null,
      },
    });
  }

  async update(id: number, data: Partial<OtpData>): Promise<OtpData> {
    const transaction = await sequelize.transaction();

    try {
      const otpData = await this.findById(id);
      await otpData.update(data, { transaction });
      await transaction.commit();
      return otpData;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateByUserId(
    user_id: number,
    data: Partial<OtpData>
  ): Promise<OtpData> {
    const transaction = await sequelize.transaction();

    try {
      const otpData = await this.findByUserId(user_id);
      await otpData.update(data, { transaction });
      await transaction.commit();
      return otpData;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const otpData = await this.findById(id);
      await otpData.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteByUserId(user_id: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const otpData = await this.findByUserId(user_id);
      await otpData.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

