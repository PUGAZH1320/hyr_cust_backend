import { Response } from "express";
import { errorCodes, SupportedLanguages } from "../constants/constants.js";
import i18n from "i18n";

export const handleSuccess = (
  res: Response,
  translationKey: string,
  data: any,
  statusCode: number = errorCodes.resOk,
  lang: SupportedLanguages = SupportedLanguages.EN
) => {
  i18n.setLocale(lang);
  const message = i18n.__(translationKey) || translationKey;

  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};
