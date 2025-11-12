export interface IDecodedToken {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

