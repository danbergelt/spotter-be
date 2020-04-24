import { COLLECTIONS } from '../db/mongo.constants';
import * as TE from 'fp-ts/lib/TaskEither';
import { Params } from './createPw.types';
import { tc } from '../utils/tc';

const { PASSWORDS } = COLLECTIONS;

export const createPw = (params: Params): TE.TaskEither<Error, string> => {
  const { db, user } = params;
  return tc(async () => {
    await db(PASSWORDS).insertOne({ password: user.password, user: user._id });
    return user._id;
  });
};
