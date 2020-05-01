import { COLLECTIONS } from '../utils/constants';
import { InsertOneWriteOpResult } from 'mongodb';
import { DAO } from '../index.types';
import { HTTPEither } from '../types';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { badGateway } from '../utils/errors';

const { USERS } = COLLECTIONS;

// eslint-disable-next-line
export const createUser = (db: DAO, email: string): HTTPEither<InsertOneWriteOpResult<any>> => {
  return tryCatch(async () => await db(USERS).insertOne({ email }), badGateway);
};
