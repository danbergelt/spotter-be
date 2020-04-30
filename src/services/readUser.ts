import { DAO } from '../index.types';
import { tryCatch, chain, right, left } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { e } from '../utils/e';
import { BAD_REQUEST, BAD_GATEWAY } from 'http-status-codes';
import { HTTPEither } from '../types';
import { Email } from './user.types';
import { pipe } from 'fp-ts/lib/pipeable';

const { USERS } = COLLECTIONS;

export const readUser = (db: DAO, creds: Partial<Email>): HTTPEither<Email> => {
  return pipe(
    tryCatch(
      async (): Promise<null | Email> => await db(USERS).findOne(creds),
      () => e('Bad gateway', BAD_GATEWAY)
    ),
    chain(user => (user ? right(user) : left(e('Invalid credentials', BAD_REQUEST))))
  );
};
