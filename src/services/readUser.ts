import { DAO } from '../index.types';
import { tryCatch, chain, right, left } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { e } from '../utils/e';
import { BAD_REQUEST, BAD_GATEWAY } from 'http-status-codes';
import { HTTPEither } from 'src/types';
import { Email } from './user.types';
import { pipe } from 'fp-ts/lib/pipeable';

const { USERS } = COLLECTIONS;

export const readUser = (db: DAO, email: string): HTTPEither<Email> => {
  return pipe(
    tryCatch(
      async (): Promise<null | Email> => await db(USERS).findOne({ email }),
      () => e('Bad gateway', BAD_GATEWAY)
    ),
    chain(user => (user ? right(user) : left(e('Invalid credentials', BAD_REQUEST))))
  );
};
