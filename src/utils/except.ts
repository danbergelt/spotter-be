// selectively turn off CORS for specific routes

import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line
const { pathToRegexp } = require('path-to-regexp');

// eslint-disable-next-line
function except(path: string[], fn: Function): any {
  const regexp = pathToRegexp(path);
  return function(
    req: Request,
    res: Response,
    next: NextFunction
  ): Function | void {
    if (regexp.test(req.path)) return next();
    else return fn(req, res, next);
  };
}

export default except;
