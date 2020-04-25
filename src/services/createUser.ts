import { COLLECTIONS } from '../db/mongo.constants';
import { tc } from '../utils/tc';
import { InsertOneWriteOpResult } from 'mongodb';
import { Agent } from '../db/mongo.types';
import { Res } from '../types';
import { BAD_GATEWAY } from 'http-status-codes';

const { USERS } = COLLECTIONS;

// eslint-disable-next-line
export const createUser = (db: Agent, email: string): Res<InsertOneWriteOpResult<any>> => {
  return tc(BAD_GATEWAY, async () => await db(USERS).insertOne({ email }));
};
