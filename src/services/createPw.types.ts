import { Agent } from 'src/db/mongo.types';
import { User } from './user.types';

export interface Params {
  db: Agent;
  user: User;
}
