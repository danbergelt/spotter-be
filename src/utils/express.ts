import { Request, Response, NextFunction } from 'express';
import { semigroupString as S } from 'fp-ts/lib/Semigroup';

// builds a path with the format --> baseurl/collection/...rest
export const path = (c: string) => (r = ''): string => S.concat(S.concat('/api/auth', c), r);

// automatically jetty uncaught errors into the express error handler
type Fn = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
export const resolver = (fn: Fn): Fn => async (req, res, next): Promise<Response | void> =>
  Promise.resolve(fn(req, res, next)).catch(next); // eslint-disable-line
