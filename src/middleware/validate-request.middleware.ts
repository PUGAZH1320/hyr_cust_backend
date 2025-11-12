import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "../utils/app-error.js";
import { StatusCode } from "../constants/constants.js";

export const validateRequest = (schema: { body?: AnyZodObject }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        await schema.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return next(
          new AppError(
            error.errors[0].message,
            StatusCode.BadRequest,
            validationErrors
          )
        );
      }
      next(error);
    }
  };
};

