import { Request, Response, NextFunction } from "express";
import { ProfileService } from "../services/profile.service.js";
import { AppError } from "../utils/app-error.js";
import { catchAsync } from "../utils/catch-async.js";
import { logger } from "../utils/logger.js";
import { errorCodes, StatusCode } from "../constants/constants.js";
import { handleSuccess } from "../middleware/error-handler.middleware.js";

class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  getProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Get user_id from decoded token (set by authenticateToken middleware)
        if (!req.user || !req.user.id) {
          return next(
            new AppError("User not authenticated", StatusCode.UnAuthorized)
          );
        }

        const userId = req.user.id;

        const user = await this.profileService.getProfile(userId);

        handleSuccess(res, "profile_fetched", user, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching profile:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  changePhone = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Get user_id from decoded token (set by authenticateToken middleware)
        if (!req.user || !req.user.id) {
          return next(
            new AppError("User not authenticated", StatusCode.UnAuthorized)
          );
        }

        const userId = req.user.id;
        const { phoneNumber, countryCode } = req.body;

        const result = await this.profileService.changePhone(
          userId,
          phoneNumber,
          countryCode
        );

        // Note: In production, send OTP via SMS/Email
        // For now, we're returning it in the response (remove in production)
        handleSuccess(
          res,
          "otp_sent_for_phone_change",
          {
            phoneNumber,
            countryCode,
            // Remove OTP from response in production
            otp: result.otp,
          },
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error changing phone:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  verifyPhone = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Get user_id from decoded token (set by authenticateToken middleware)
        if (!req.user || !req.user.id) {
          return next(
            new AppError("User not authenticated", StatusCode.UnAuthorized)
          );
        }

        const userId = req.user.id;
        const { phoneNumber, countryCode, otp } = req.body;

        await this.profileService.verifyPhone(
          userId,
          phoneNumber,
          countryCode,
          otp
        );

        handleSuccess(
          res,
          "phone_verified_and_updated",
          {
            phoneNumber,
            countryCode,
          },
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error verifying phone:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );
}

export default new ProfileController();
