import { COLLECTIONS } from '../db/mongo.constants';
import * as TE from 'fp-ts/lib/TaskEither';
import { Params } from './createUser.types';
import { tc } from '../utils/tc';
import { InsertOneWriteOpResult } from 'mongodb';

const { USERS } = COLLECTIONS;

export const createUser = (params: Params): TE.TaskEither<Error, InsertOneWriteOpResult<any>> => {
  const { db, email } = params;
  return tc(async () => await db(USERS).insertOne({ email }));
};
