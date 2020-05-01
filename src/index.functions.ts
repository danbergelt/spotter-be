import { Server } from 'http';
import { Express } from 'express';
import { MW } from './index.types';

const { PORT, NODE_ENV } = process.env;

export default {
  logRejection: <T>(loggee: T, logger = console.log): void => logger(loggee),
  closeServer: (s: Server, p: NodeJS.Process): Server => s.close(() => p.exit(1)),
  success: (logger = console.log): void => logger(`Port: ${PORT}\nMode: ${NODE_ENV}`),
  inject: (a: Express) => (...mw: MW[]): Express => mw.reduce((a: Express, m) => a.use(m), a)
};
