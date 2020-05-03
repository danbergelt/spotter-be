import { Request, Response, NextFunction } from 'express';

type Res = Promise<Response | void> | Response | void;

export type Fn = (req: Request, res: Response, next: NextFunction) => Res;

// fallback HOF to automatically jetty uncaught errors into the express error handler

export function resolver(fn: Fn): Fn {
  return function(req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next); // eslint-disable-line
  } as Fn;
}
