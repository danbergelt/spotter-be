import { COLLECTIONS } from '../utils/constants';
import { DAO } from '../index.types';
import { HTTPEither } from '../types';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, tryCatch } from 'fp-ts/lib/TaskEither';
import { encrypt } from '../utils/encrypt';
import { badGateway } from '../utils/errors';

const { PASSWORDS } = COLLECTIONS;

export const createPw = (db: DAO, user: string, pw: string, ec = encrypt): HTTPEither<string> => {
  return pipe(
    ec(pw),
    chain(password =>
      tryCatch(async () => {
        await db(PASSWORDS).insertOne({ password, user });
        return user;
      }, badGateway)
    )
  );
};

export type CreatePw = typeof createPw;
