import { Request, Response, NextFunction } from 'express';

export type Fn = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
