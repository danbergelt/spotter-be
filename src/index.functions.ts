import { Express } from 'express';
import { MW } from './index.types';

export default {
  inject: (app: Express) => (...mw: MW[]): void => mw.forEach(m => app.use(m))
};
