import { Request, Response, NextFunction } from 'express';
import { semigroupString as S } from 'fp-ts/lib/Semigroup';

// builds a path with the format --> baseurl/collection/...rest
export const path = (c: string) => (r: string): string => S.concat(S.concat('/api/auth', c), r);

// automatically jetty uncaught errors into the express error handler
export const resolver = (fn: Fn): Fn => async (req, res, next): Res =>
  Promise.resolve(fn(req, res, next)).catch(next); // eslint-disable-line

type Res = Promise<Response | void>;

export type Fn = (req: Request, res: Response, next: NextFunction) => Res;
