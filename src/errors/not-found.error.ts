import { AppError } from "../utils/app-error.js";
import { StatusCode } from "../constants/constants.js";

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, StatusCode.NotFound);
  }
}
