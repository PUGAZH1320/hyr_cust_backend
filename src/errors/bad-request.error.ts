import { AppError } from "../utils/app-error.js";
import { StatusCode } from "../constants/constants.js";

export class BadRequestError extends AppError {
  constructor(
    message: string = "Bad request",
    validationErrors?: Record<string, string>[]
  ) {
    super(message, StatusCode.BadRequest, validationErrors);
  }
}
