import { Request, Response, NextFunction } from "express";
import { TempPhoneService } from "../services/temp-phone.service.js";
import { AppError } from "../utils/app-error.js";
import { catchAsync } from "../utils/catch-async.js";
import { logger } from "../utils/logger.js";
import { errorCodes } from "../constants/constants.js";
import { handleSuccess } from "../middleware/error-handler.middleware.js";

class TempPhoneController {
  private tempPhoneService: TempPhoneService;

  constructor() {
    this.tempPhoneService = new TempPhoneService();
  }

  create = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tempPhone = await this.tempPhoneService.create(req.body);
        handleSuccess(
          res,
          "temp_phone_created",
          tempPhone,
          errorCodes.resCreated,
          req.lang
        );
      } catch (error) {
        logger.error("Error creating Temp Phone:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  findAll = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tempPhones = await this.tempPhoneService.findAll();
        handleSuccess(res, "success", tempPhones, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching Temp Phones:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  findByUserId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tempPhone = await this.tempPhoneService.findByUserId(
          Number(req.params.user_id)
        );
        handleSuccess(res, "success", tempPhone, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching Temp Phone:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  update = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tempPhone = await this.tempPhoneService.update(
          Number(req.params.user_id),
          req.body
        );
        handleSuccess(
          res,
          "temp_phone_updated",
          tempPhone,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error updating Temp Phone:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  delete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.tempPhoneService.delete(Number(req.params.user_id));
        handleSuccess(
          res,
          "temp_phone_deleted",
          null,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error deleting Temp Phone:", error);
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
        const { user_id, otp } = req.body;
        const isValid = await this.tempPhoneService.verifyOtp(
          Number(user_id),
          otp
        );
        handleSuccess(
          res,
          isValid ? "otp_verified" : "otp_invalid",
          { verified: isValid },
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
}

export default new TempPhoneController();
