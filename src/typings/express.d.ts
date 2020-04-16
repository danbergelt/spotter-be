import { Agent } from '../db/mongo.types';

interface Locals {
  db: Agent;
}

declare module 'express' {
  export interface Response {
    locals: Locals;
  }
}
