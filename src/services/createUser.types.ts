import { Agent } from '../db/mongo.types';

export interface Params {
  db: Agent;
  email: string;
}
