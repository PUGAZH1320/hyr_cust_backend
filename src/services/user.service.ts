import { User } from "../models/user.model.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { Transaction } from "sequelize";
import { sequelize } from "../db/config.js";

export class UserService {
  async create(
    data: Partial<User>,
    transaction?: Transaction
  ): Promise<User> {
    return await User.create(data, { transaction });
  }

  async findById(id: number): Promise<User> {
    // Note: deletedAt check is handled automatically by paranoid: true
    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    // Note: deletedAt check is handled automatically by paranoid: true
    return await User.findAll();
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const transaction = await sequelize.transaction();

    try {
      const user = await this.findById(id);
      await user.update(data, { transaction });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const user = await this.findById(id);
      await user.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

