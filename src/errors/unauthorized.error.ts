import { AppError } from "../utils/app-error.js";
import { StatusCode } from "../constants/constants.js";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, StatusCode.UnAuthorized);
  }
}
