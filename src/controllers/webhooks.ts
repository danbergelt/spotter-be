import { Request, Response } from 'express';

export const rebuild = (req: Request, res: Response): Response => {
  console.log(req);

  return res.status(200);
};
