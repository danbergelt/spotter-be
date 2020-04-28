import { COLLECTIONS } from '../utils/constants';
import { InsertOneWriteOpResult, MongoError } from 'mongodb';
import { DAO } from '../index.types';
import { HTTPEither } from '../types';
import { BAD_GATEWAY } from 'http-status-codes';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { e } from '../utils/e';

const { USERS } = COLLECTIONS;

// eslint-disable-next-line
export const createUser = (db: DAO, email: string): HTTPEither<InsertOneWriteOpResult<any>> => {
  return tryCatch(
    async () => await db(USERS).insertOne({ email }),
    error => e((error as MongoError).message, BAD_GATEWAY)
  );
};
