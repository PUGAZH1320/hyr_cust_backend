import { Request, Response, NextFunction } from "express";
import { UserSessionService } from "../services/user-session.service.js";
import { AppError } from "../utils/app-error.js";
import { catchAsync } from "../utils/catch-async.js";
import { logger } from "../utils/logger.js";
import { errorCodes } from "../constants/constants.js";
import { handleSuccess } from "../middleware/error-handler.middleware.js";

class UserSessionController {
  private userSessionService: UserSessionService;

  constructor() {
    this.userSessionService = new UserSessionService();
  }

  create = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userSession = await this.userSessionService.create(req.body);
        handleSuccess(
          res,
          "user_session_created",
          userSession,
          errorCodes.resCreated,
          req.lang
        );
      } catch (error) {
        logger.error("Error creating User Session:", error);
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
        const userSessions = await this.userSessionService.findAll();
        handleSuccess(res, "success", userSessions, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching User Sessions:", error);
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
        const userSession = await this.userSessionService.findById(
          Number(req.params.id)
        );
        handleSuccess(res, "success", userSession, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching User Session:", error);
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
        const userSession = await this.userSessionService.findByUserId(
          Number(req.params.user_id)
        );
        handleSuccess(res, "success", userSession, errorCodes.resOk, req.lang);
      } catch (error) {
        logger.error("Error fetching User Session:", error);
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
        const userSession = await this.userSessionService.update(
          Number(req.params.id),
          req.body
        );
        handleSuccess(
          res,
          "user_session_updated",
          userSession,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error updating User Session:", error);
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
        const userSession = await this.userSessionService.updateByUserId(
          Number(req.params.user_id),
          req.body
        );
        handleSuccess(
          res,
          "user_session_updated",
          userSession,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error updating User Session:", error);
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
        await this.userSessionService.delete(Number(req.params.id));
        handleSuccess(
          res,
          "user_session_deleted",
          null,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error deleting User Session:", error);
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
        await this.userSessionService.deleteByUserId(Number(req.params.user_id));
        handleSuccess(
          res,
          "user_session_deleted",
          null,
          errorCodes.resOk,
          req.lang
        );
      } catch (error) {
        logger.error("Error deleting User Session:", error);
        if (error instanceof AppError) {
          next(error as AppError);
        } else {
          next(error);
        }
      }
    }
  );
}

export default new UserSessionController();

