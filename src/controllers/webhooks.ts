import { Request, Response } from 'express';

export const rebuild = (req: Request, res: Response): void => {
  console.log(req);

  return res.status(200).end();
};
