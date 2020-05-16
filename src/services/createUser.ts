import { COLLECTIONS } from '../utils/constants';
import { DAO } from '../index.types';
import { HTTPEither, Write } from '../types';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { forkMongoError } from '../utils/sanitization';
import { User } from '../controllers/users';

const { USERS } = COLLECTIONS;

export const createUser = (db: DAO, user: User): HTTPEither<Write> => {
  return tryCatch(async () => await db(USERS).insertOne(user), forkMongoError);
};
