import { Request, Response, NextFunction } from 'express';
import { semigroupString } from 'fp-ts/lib/Semigroup';

type Table = string;
type Rest = string;
type Endpoint = string;
type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

const base = '/api/auth';

// builds a path with the format --> baseurl/table/...rest
export const path = (table: Table) => (rest = '' as Rest): Endpoint =>
  semigroupString.concat(semigroupString.concat(base, table), rest);

// automatically send uncaught errors into the express error handler
export const resolver = (c: Controller): Controller => async (req, res, next) =>
  Promise.resolve(c(req, res, next)).catch(next); // eslint-disable-line
