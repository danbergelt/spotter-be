import { DAO } from '../index.types';

declare module 'express' {
  export interface Request {
    app: {
      locals: {
        db: DAO;
      };
    };
  }
}
