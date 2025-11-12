import { AppError } from "../utils/app-error.js";
import { StatusCode } from "../constants/constants.js";

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, StatusCode.Forbidden);
  }
}
