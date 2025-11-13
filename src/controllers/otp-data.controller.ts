import { Request, Response, NextFunction } from "express";
import { OtpDataService } from "../services/otp-data.service.js";
import { AppError } from "../utils/app-error.js";
import { catchAsync } from "../utils/catch-async.js";
import { logger } from "../utils/logger.js";
import { errorCodes } from "../constants/constants.js";
import { handleSuccess } from "../middleware/error-handler.middleware.js";

class OtpDataController {
  private otpDataService: OtpDataService;

  constructor() {
    this.otpDataService = new OtpDataService();
  }

  create = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const otpData = await this.otpDataService.create(req.body);
        handleSuccess(
          res,
          "otp_data_created",
          otpData,
          errorCodes.resCreated,
          req.lang
        );
      } catch (error) {
        logger.error("Error creating OTP Data:", error);
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
        const otpDataList = await this.otpDataService.findAll();
        handleSuccess(res, "success", otpDataList, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching OTP Data:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  findById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const otpData = await this.otpDataService.findById(
          Number(req.params.id)
        );
        handleSuccess(res, "success", otpData, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching OTP Data:", error);
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
        const otpData = await this.otpDataService.findByUserId(
          Number(req.params.user_id)
        );
        handleSuccess(res, "success", otpData, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching OTP Data:", error);
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
        const otpData = await this.otpDataService.update(
          Number(req.params.id),
          req.body
        );
        handleSuccess(
          res,
          "otp_data_updated",
          otpData,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error updating OTP Data:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  updateByUserId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const otpData = await this.otpDataService.updateByUserId(
          Number(req.params.user_id),
          req.body
        );
        handleSuccess(
          res,
          "otp_data_updated",
          otpData,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error updating OTP Data:", error);
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
        await this.otpDataService.delete(Number(req.params.id));
        handleSuccess(
          res,
          "otp_data_deleted",
          null,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error deleting OTP Data:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );

  deleteByUserId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.otpDataService.deleteByUserId(Number(req.params.user_id));
        handleSuccess(
          res,
          "otp_data_deleted",
          null,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error deleting OTP Data:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );
}

export default new OtpDataController();

