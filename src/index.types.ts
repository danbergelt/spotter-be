import { RequestHandler, ErrorRequestHandler } from 'express';

export type MW = RequestHandler | ErrorRequestHandler;
