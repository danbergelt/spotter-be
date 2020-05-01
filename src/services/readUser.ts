import { DAO } from '../index.types';
import { tryCatch, chain, right, left } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { HTTPEither, Nullable } from '../types';
import { Email } from './user.types';
import { pipe } from 'fp-ts/lib/pipeable';
import { invalidCredentials, badGateway } from '../utils/errors';

const { USERS } = COLLECTIONS;

export const readUser = (db: DAO, creds: Partial<Email>): HTTPEither<Email> => {
  return pipe(
    tryCatch(async (): Promise<Nullable<Email>> => await db(USERS).findOne(creds), badGateway),
    chain(user => (user ? right(user) : left(invalidCredentials())))
  );
};
