import { Agent } from '../db/mongo.types';
import { User } from '../services/user.types';

interface Locals {
  db: Agent;
  payload: string | Partial<User>;
}

declare module 'express' {
  export interface Response {
    locals: Locals;
  }
  export interface Request {
    body: User;
  }
}
