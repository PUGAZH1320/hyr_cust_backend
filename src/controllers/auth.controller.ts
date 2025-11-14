import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { AppError } from "../utils/app-error.js";
import { catchAsync } from "../utils/catch-async.js";
import { logger } from "../utils/logger.js";
import { errorCodes, StatusCode } from "../constants/constants.js";
import { handleSuccess } from "../middleware/error-handler.middleware.js";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  sendOtp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { phoneNumber, countryCode, referalId, hashKey } = req.body;

        const result = await this.authService.findOrCreateUser({
          phoneNumber,
          countryCode,
          referalId,
          hashKey,
        });

        // Note: In production, you should send the OTP via SMS/Email
        // For now, we're returning it in the response (remove in production)
        handleSuccess(
          res,
          result.isNewUser ? "user_created_otp_sent" : "otp_sent",
          {
            userId: result.user.id,
            phoneNumber: result.user.phoneNumber,
            countryCode: result.user.countryCode,
            isNewUser: result.isNewUser,
            // Remove OTP from response in production
            otp: result.otp,
          },
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error sending OTP:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  verifyOtp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { phoneNumber, countryCode, otp_value, fcm_token } = req.body;

        const result = await this.authService.verifyOtp({
          phoneNumber,
          countryCode,
          otp_value,
          fcm_token,
        });

        handleSuccess(
          res,
          "otp_verified",
          {
            userId: result.user.id,
            phoneNumber: result.user.phoneNumber,
            countryCode: result.user.countryCode,
            isVerified: result.user.isVerified,
            referalCode: result.user.referalCode,
            token: result.token,
            sessionId: result.session.id,
          },
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error verifying OTP:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  updateFcm = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { fcm_token } = req.body;

        // Extract token from Authorization header
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return next(
            new AppError("Authorization header is missing", StatusCode.UnAuthorized)
          );
        }

        const token = authHeader.split(" ")[1];

        // Get user_id from decoded token (set by authenticateToken middleware)
        if (!req.user || !req.user.id) {
          return next(
            new AppError("User not authenticated", StatusCode.UnAuthorized)
          );
        }

        const userId = req.user.id;

        const userSession = await this.authService.updateFcmToken(
          token,
          userId,
          fcm_token
        );

        handleSuccess(
          res,
          "fcm_token_updated",
          {
            sessionId: userSession.id,
            userId: userSession.user_id,
            fcm_token: userSession.fcm_token,
          },
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error updating FCM token:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  logout = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Extract token from Authorization header
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return next(
            new AppError("Authorization header is missing", StatusCode.UnAuthorized)
          );
        }

        const token = authHeader.split(" ")[1];

        // Get user_id from decoded token (set by authenticateToken middleware)
        if (!req.user || !req.user.id) {
          return next(
            new AppError("User not authenticated", StatusCode.UnAuthorized)
          );
        }

        const userId = req.user.id;

        await this.authService.logout(token, userId);

        handleSuccess(
          res,
          "logout_successful",
          null,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error during logout:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

}

export default new AuthController();

