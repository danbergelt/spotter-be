import { Request } from 'express';

// ts-ignore
export const rebuild = (req: Request): void => {
  console.log(req);
};
