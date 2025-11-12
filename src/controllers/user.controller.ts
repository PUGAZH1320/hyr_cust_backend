import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { AppError } from "../utils/app-error.js";
import { catchAsync } from "../utils/catch-async.js";
import { logger } from "../utils/logger.js";
import { errorCodes } from "../constants/constants.js";
import { handleSuccess } from "../middleware/error-handler.middleware.js";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await this.userService.create(req.body);
        handleSuccess(
          res,
          "user_created",
          user,
          errorCodes.resCreated,
          req.lang
        );
      } catch (error) {
        logger.error("Error creating User:", error);
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
        const users = await this.userService.findAll();
        handleSuccess(res, "success", users, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching Users:", error);
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
        const user = await this.userService.findById(Number(req.params.id));
        handleSuccess(res, "success", user, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching User:", error);
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
        const user = await this.userService.update(
          Number(req.params.id),
          req.body
        );
        handleSuccess(res, "user_updated", user, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error updating User:", error);
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
        await this.userService.delete(Number(req.params.id));
        handleSuccess(res, "user_deleted", null, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error deleting User:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );
}

export default new UserController();

