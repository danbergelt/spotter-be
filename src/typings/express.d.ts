import { Agent } from '../middleware/db.types';
import { User } from '../services/user.types';

declare module 'express' {
  export interface Request {
    body: User;
    app: {
      locals: {
        db: Agent;
      };
    };
  }
}
