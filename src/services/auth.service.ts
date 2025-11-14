import { User } from "../models/user.model.js";
import { OtpData } from "../models/otp-data.model.js";
import { UserSession } from "../models/user-session.model.js";
import { UserSessionService } from "./user-session.service.js";
import { Transaction } from "sequelize";
import { sequelize } from "../db/config.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { BadRequestError } from "../errors/bad-request.error.js";
import jwt, { SignOptions } from "jsonwebtoken";

export class AuthService {
  /**
   * Generate a random OTP
   * @param length - Length of OTP (default: 4 for rideOTP, 6 for otp_data)
   */
  private generateOTP(length: number = 4): string {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  /**
   * Generate a unique referral code
   */
  private generateReferralCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  /**
   * Find or create a user based on phone number and country code
   */
  async findOrCreateUser(data: {
    phoneNumber: string;
    countryCode: string;
    referalId?: string;
    hashKey: string;
  }): Promise<{ user: User; isNewUser: boolean; otp: string }> {
    const transaction = await sequelize.transaction();

    try {
      // Find existing user by phone number and country code
      // Note: deletedAt check is handled automatically by paranoid: true
      let user = await User.findOne({
        where: {
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode,
        },
        transaction,
      });

      const isNewUser = !user;
      let referedBy: number | null = null;

      // Handle referral logic if referalId is provided
      if (data.referalId) {
        const referrer = await User.findOne({
          where: {
            referalCode: data.referalId,
          },
          transaction,
        });

        if (referrer) {
          referedBy = Number(referrer.id);
        }
      }

      // Generate OTPs
      const rideOTP = this.generateOTP(4);
      const otpValue = this.generateOTP(6);

      if (user) {
        // Update existing user
        await user.update(
          {
            rideOTP,
            referedBy: referedBy || user.referedBy,
          },
          { transaction }
        );
      } else {
        // Create new user with default values
        user = await User.create(
          {
            countryCode: data.countryCode,
            phoneNumber: data.phoneNumber,
            fullName: "", // Default empty, can be updated later
            Gender: 0, // Default value
            isBusinessUser: 0, // Default value
            isActive: 1, // Active by default
            emailID: "", // Default empty, can be updated later
            rideOTP,
            isVerified: 0, // Not verified initially
            referalCode: this.generateReferralCode(),
            referedBy,
          },
          { transaction }
        );
      }

      // Create or update OTP data
      // Note: deletedAt check is handled automatically by paranoid: true
      const existingOtpData = await OtpData.findOne({
        where: {
          user_id: Number(user.id),
        },
        transaction,
      });

      if (existingOtpData) {
        await existingOtpData.update(
          {
            otp_value: otpValue,
          },
          { transaction }
        );
      } else {
        await OtpData.create(
          {
            user_id: Number(user.id),
            otp_value: otpValue,
          },
          { transaction }
        );
      }

      await transaction.commit();

      return {
        user,
        isNewUser,
        otp: otpValue, // Return the 6-digit OTP for otp_data
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Find user by phone number and country code
   */
  async findByPhone(
    phoneNumber: string,
    countryCode: string
  ): Promise<User | null> {
    return await User.findOne({
      where: {
        phoneNumber,
        countryCode,
      },
    });
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: number, email: string = ""): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || "30d";

    return jwt.sign(
      {
        id: userId,
        email: email,
      },
      jwtSecret,
      {
        expiresIn,
      } as SignOptions
    );
  }

  /**
   * Verify OTP and create user session
   */
  async verifyOtp(data: {
    phoneNumber: string;
    countryCode: string;
    otp_value: string;
    fcm_token?: string;
  }): Promise<{ user: User; token: string; session: UserSession }> {
    const transaction = await sequelize.transaction();

    try {
      // Find user by phone number and country code
      // Note: deletedAt check is handled automatically by paranoid: true
      const user = await User.findOne({
        where: {
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode,
        },
        transaction,
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      // Find and validate OTP
      // Note: deletedAt check is handled automatically by paranoid: true
      const otpData = await OtpData.findOne({
        where: {
          user_id: Number(user.id),
        },
        transaction,
      });

      if (!otpData) {
        throw new NotFoundError("OTP not found. Please request a new OTP.");
      }

      if (otpData.otp_value !== data.otp_value) {
        throw new BadRequestError("Invalid OTP");
      }

      // Generate referral code if user doesn't have one
      let referralCode = user.referalCode;
      if (!referralCode) {
        referralCode = this.generateReferralCode();
      }

      // Update user: isVerified = true, referalCode = generated code
      await user.update(
        {
          isVerified: 1,
          referalCode: referralCode,
        },
        { transaction }
      );

      // Get all user sessions for this user
      // Note: deletedAt check is handled automatically by paranoid: true
      const userSessions = await UserSession.findAll({
        where: {
          user_id: Number(user.id),
        },
        order: [["created_at", "ASC"]], // Order by oldest first (using DB column name)
        transaction,
      });

      // If count > 3, delete the oldest one
      if (userSessions.length > 3) {
        const oldestSession = userSessions[0];
        await oldestSession.destroy({ transaction });
      }

      // Generate JWT token
      const token = this.generateToken(Number(user.id), user.emailID);

      // Create user session
      const session = await UserSession.create(
        {
          user_id: Number(user.id),
          fcm_token: data.fcm_token || "",
          token: token,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        user,
        token,
        session,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Update FCM token for user session
   */
  async updateFcmToken(
    token: string,
    userId: number,
    fcmToken: string
  ): Promise<UserSession> {
    const transaction = await sequelize.transaction();
    const userSessionService = new UserSessionService();

    try {
      // Find user session by token and user_id
      const userSession = await userSessionService.findByTokenAndUserId(
        token,
        userId
      );

      if (!userSession) {
        throw new NotFoundError("User session not found");
      }

      // Update FCM token
      await userSession.update(
        {
          fcm_token: fcmToken,
        },
        { transaction }
      );

      await transaction.commit();

      return userSession;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Logout user by deleting the current session
   */
  async logout(token: string, userId: number): Promise<void> {
    const userSessionService = new UserSessionService();
    await userSessionService.deleteByTokenAndUserId(token, userId);
  }
}
