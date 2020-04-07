import { Request, Response, NextFunction } from 'express';

/*==  =====================================================
Description
*/

type C = (req: Request, res: Response, next: NextFunction) => Promise<any>; // eslint-disable-line

function asyncHandler(fn: C) {
  // eslint-disable-next-line
  return function(req: Request, res: Response, next: NextFunction): any {
    Promise.resolve(fn(req, res, next)).catch(next); // eslint-disable-line
  };
}

export default asyncHandler;
