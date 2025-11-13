import { UserSession } from "../models/user-session.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { Transaction } from "sequelize";
import { sequelize } from "../db/config.js";

export class UserSessionService {
  async create(
    data: Partial<UserSession>,
    transaction?: Transaction
  ): Promise<UserSession> {
    return await UserSession.create(data, { transaction });
  }

  async findById(id: number): Promise<UserSession> {
    const userSession = await UserSession.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!userSession) {
      throw new NotFoundError(`User session with id ${id} not found`);
    }

    return userSession;
  }

  async findByUserId(user_id: number): Promise<UserSession> {
    const userSession = await UserSession.findOne({
      where: {
        user_id,
        deletedAt: null,
      },
    });

    if (!userSession) {
      throw new NotFoundError(`User session with user_id ${user_id} not found`);
    }

    return userSession;
  }

  async findAll(): Promise<UserSession[]> {
    return await UserSession.findAll({
      where: {
        deletedAt: null,
      },
    });
  }

  async update(id: number, data: Partial<UserSession>): Promise<UserSession> {
    const transaction = await sequelize.transaction();

    try {
      const userSession = await this.findById(id);
      await userSession.update(data, { transaction });
      await transaction.commit();
      return userSession;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateByUserId(
    user_id: number,
    data: Partial<UserSession>
  ): Promise<UserSession> {
    const transaction = await sequelize.transaction();

    try {
      const userSession = await this.findByUserId(user_id);
      await userSession.update(data, { transaction });
      await transaction.commit();
      return userSession;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const userSession = await this.findById(id);
      await userSession.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteByUserId(user_id: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const userSession = await this.findByUserId(user_id);
      await userSession.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

