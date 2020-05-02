import { Request, Response, NextFunction } from 'express';

export type Fn = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

// fallback HOF to automatically jetty uncaught errors into the express error handler

export function resolver(fn: Fn): Fn {
  return function(req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next); // eslint-disable-line
  } as Fn;
}
