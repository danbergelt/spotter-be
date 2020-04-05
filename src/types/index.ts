import { Request, Response, NextFunction } from 'express';

export type ExpressFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => any; // eslint-disable-line
