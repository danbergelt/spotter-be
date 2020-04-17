import { Server } from 'http';
import { RequestHandler, Express } from 'express';

const { PORT, NODE_ENV } = process.env;

export default {
  logRejection: <T>(loggee: T, logger = console.log): void => logger(loggee),
  closeServer: (s: Server, p: NodeJS.Process): Server => s.close(() => p.exit(1)),
  success: (logger = console.log): void => logger(`Port: ${PORT}\nMode: ${NODE_ENV}`),
  inject: (a: Express) => (...mw: RequestHandler[]): void => mw.forEach(m => a.use(m))
};
