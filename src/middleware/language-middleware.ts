import { Request, Response, NextFunction } from "express";
import { SupportedLanguages } from "../constants/constants.js";

export const languageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const langHeader = req.headers["x-language"] as string;
  const supportedLangs = Object.values(SupportedLanguages);

  if (langHeader && supportedLangs.includes(langHeader as SupportedLanguages)) {
    req.lang = langHeader as SupportedLanguages;
  } else {
    req.lang = SupportedLanguages.EN;
  }

  next();
};

