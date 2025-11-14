import { User } from "../models/user.model.js";
import { TempPhone } from "../models/temp-phone.model.js";
import { UserSessionService } from "./user-session.service.js";
import { UserService } from "./user.service.js";
import { TempPhoneService } from "./temp-phone.service.js";
import { Transaction } from "sequelize";
import { sequelize } from "../db/config.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { BadRequestError } from "../errors/bad-request.error.js";

export class ProfileService {
  /**
   * Generate a random OTP
   * @param length - Length of OTP (default: 6)
   */
  private generateOTP(length: number = 6): string {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  /**
   * Get user profile by user ID
   */
  async getProfile(userId: number): Promise<User> {
    const userService = new UserService();
    return await userService.findById(userId);
  }

  /**
   * Change phone number - send OTP
   */
  async changePhone(
    userId: number,
    phoneNumber: string,
    countryCode: string
  ): Promise<{ otp: string }> {
    const transaction = await sequelize.transaction();
    const tempPhoneService = new TempPhoneService();

    try {
      // Generate 6-digit OTP
      const otp = this.generateOTP(6);

      // Find or create temp_phone entry
      const existingTempPhone = await tempPhoneService.findByUserIdAndPhone(
        userId,
        phoneNumber
      );

      if (existingTempPhone) {
        // Update existing entry
        await existingTempPhone.update(
          {
            otp,
          },
          { transaction }
        );
      } else {
        // Create new entry (need to handle if user_id already exists)
        try {
          await TempPhone.create(
            {
              user_id: userId,
              ph_no: phoneNumber,
              otp,
            },
            { transaction }
          );
        } catch (error: any) {
          // If user_id already exists, update it
          if (error.name === "SequelizeUniqueConstraintError") {
            // Note: deletedAt check is handled automatically by paranoid: true
            const tempPhone = await TempPhone.findOne({
              where: { user_id: userId },
              transaction,
            });
            if (tempPhone) {
              await tempPhone.update(
                {
                  ph_no: phoneNumber,
                  otp,
                },
                { transaction }
              );
            }
          } else {
            throw error;
          }
        }
      }

      await transaction.commit();

      // Note: In production, send OTP via SMS/Email
      return { otp };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Verify phone number change OTP and update phone number
   */
  async verifyPhone(
    userId: number,
    phoneNumber: string,
    countryCode: string,
    otp: string
  ): Promise<void> {
    const transaction = await sequelize.transaction();
    const tempPhoneService = new TempPhoneService();
    const userService = new UserService();
    const userSessionService = new UserSessionService();

    try {
      // Find temp_phone entry by user_id and phone number
      const tempPhone = await tempPhoneService.findByUserIdAndPhone(
        userId,
        phoneNumber
      );

      if (!tempPhone) {
        throw new NotFoundError("OTP not found. Please request a new OTP.");
      }

      // Validate OTP
      if (tempPhone.otp !== otp) {
        throw new BadRequestError("Invalid OTP");
      }

      // Update phone number in user table
      const user = await userService.findById(userId);
      await user.update(
        {
          phoneNumber,
          countryCode,
        },
        { transaction }
      );

      // Delete all user sessions
      const userSessions = await userSessionService.findAllByUserId(userId);
      for (const session of userSessions) {
        await session.destroy({ transaction });
      }

      // Delete temp_phone entry
      await tempPhone.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

