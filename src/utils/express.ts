import { Request, Response, NextFunction } from 'express';

type Result = Promise<Response | void> | Response | void;
type Table = string;
type Rest = string;
type Endpoint = string;
type Controller = (req: Request, res: Response, next: NextFunction) => Result;

// builds a path with the format --> baseurl/table/...rest
type Path = (t: Table) => (r?: Rest) => Endpoint;
const path: Path = t => (r = '') => `/api/auth${t}${r}`;

// Resolves async Express controllers, pass uncaught errors into error-handling middleware
type Resolver = (c: Controller) => Controller;
const resolver: Resolver = c => async (req, res, next) =>
  Promise.resolve(c(req, res, next)).catch(next); // eslint-disable-line

export { Controller, path, resolver };
