import { NextFunction } from 'express';

// try/catch wrapper that automatically calls next on a failure=

export const tc = async <T>(next: NextFunction, cb: () => Promise<T>): Promise<T | void> => {
  try {
    return await cb();
  } catch (error) {
    return next(error);
  }
};
