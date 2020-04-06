import { Request, Response, NextFunction } from 'express';

export type ExpressFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => any; // eslint-disable-line

export interface HttpException extends Error {
  code?: number;
  statusCode?: number;
  message: string;
  errors: { message: string }[];
}

export interface MongooseError {
  message: string;
  status: number;
}
