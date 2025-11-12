import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { StatusCode, SupportedLanguages } from "../constants/constants.js";
import { logger } from "../utils/logger.js";
import i18n from "i18n";

const handleOperationalError = (
  err: AppError,
  req: Request,
  res: Response,
  lang: SupportedLanguages
) => {
  i18n.setLocale(lang);
  const message = err.message;

  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message,
    ...(err.validationErrors && { errors: err.validationErrors }),
  });
};

const handleGenericError = (
  err: any,
  req: Request,
  res: Response,
  lang: SupportedLanguages
) => {
  i18n.setLocale(lang);

  logger.error({
    status: "error",
    code: StatusCode.InternalServerError,
    path: req.path,
    method: req.method,
    message: err.message,
    stack: err.stack,
    ip: req.ip,
  });

  return res.status(StatusCode.InternalServerError).json({
    success: false,
    status: "error",
    message: "Something went wrong",
    ...(process.env.NODE_ENV === "development" && {
      err: err.message,
      stack: err.stack,
    }),
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const lang = req.lang || SupportedLanguages.EN;

  if (err instanceof AppError) {
    return handleOperationalError(err, req, res, lang);
  }

  return handleGenericError(err, req, res, lang);
};

export { handleSuccess } from "../handlers/response-handler.js";
