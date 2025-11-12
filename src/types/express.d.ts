import { SupportedLanguages } from "../constants/constants.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        [key: string]: any;
      };
      lang?: SupportedLanguages;
    }
  }
}

