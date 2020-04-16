import { NextFunction } from 'express';

export const tc = async <T>(next: NextFunction, cb: () => Promise<T>): Promise<T | void> => {
  try {
    return await cb();
  } catch (error) {
    return next(error);
  }
};
