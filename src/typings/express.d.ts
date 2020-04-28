import { DAO } from '../index.types';
import { User } from '../services/user.types';

declare module 'express' {
  export interface Request {
    body: User;
    app: {
      locals: {
        db: DAO;
      };
    };
  }
}
