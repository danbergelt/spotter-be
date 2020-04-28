import { COLLECTIONS } from '../utils/constants';
import { DAO } from '../index.types';
import { HTTPEither } from '../types';
import { BAD_GATEWAY } from 'http-status-codes';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, tryCatch } from 'fp-ts/lib/TaskEither';
import { encrypt } from '../utils/encrypt';
import { e } from '../utils/e';
import { MongoError } from 'mongodb';

const { PASSWORDS } = COLLECTIONS;

export const createPw = (db: DAO, user: string, pw: string, ec = encrypt): HTTPEither<string> => {
  return pipe(
    ec(pw),
    chain(password =>
      tryCatch(
        async () => {
          await db(PASSWORDS).insertOne({ password, user });
          return user;
        },
        error => e((error as MongoError).message, BAD_GATEWAY)
      )
    )
  );
};
