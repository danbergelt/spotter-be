import { Request, Response, NextFunction } from 'express';
import { semigroupString, fold } from 'fp-ts/lib/Semigroup';

type PathComponents = ReadonlyArray<string>;
type PathString = string;
type Result = Promise<Response | void> | Response | void;
type Controller = (req: Request, res: Response, next: NextFunction) => Result;

// builds a path with the format --> baseurl/table/...rest
type Path = (pc: PathComponents) => PathString;
const path: Path = fold(semigroupString)('/api/auth');

// Resolves async Express controllers, pass uncaught errors into error-handling middleware
type Resolver = (c: Controller) => Controller;
const resolver: Resolver = c => async (req, res, next) =>
  Promise.resolve(c(req, res, next)).catch(next); // eslint-disable-line

export { Controller, path, resolver };
