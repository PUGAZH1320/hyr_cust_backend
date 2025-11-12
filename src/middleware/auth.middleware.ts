import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error.js";
import { StatusCode } from "../constants/constants.js";
import { IDecodedToken } from "../interfaces/decoded-token.interface.js";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new AppError("Authorization header is missing", StatusCode.UnAuthorized)
      );
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return next(
        new AppError(
          "JWT secret is not configured",
          StatusCode.InternalServerError
        )
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IDecodedToken;

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new AppError("Invalid or expired token", StatusCode.UnAuthorized)
      );
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired", StatusCode.UnAuthorized));
    }
    next(new AppError("Authentication failed", StatusCode.UnAuthorized));
  }
};
