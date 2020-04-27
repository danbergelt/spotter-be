import { COLLECTIONS } from '../utils/constants';
import { tc } from '../utils/tc';
import { InsertOneWriteOpResult } from 'mongodb';
import { Agent } from '../index.types';
import { HTTPEither } from '../types';
import { BAD_GATEWAY } from 'http-status-codes';

const { USERS } = COLLECTIONS;

// eslint-disable-next-line
export const createUser = (db: Agent, email: string): HTTPEither<InsertOneWriteOpResult<any>> => {
  return tc(async () => await db(USERS).insertOne({ email }))(BAD_GATEWAY);
};
