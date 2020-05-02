import { COLLECTIONS } from '../utils/constants';
import { DAO } from '../index.types';
import { HTTPEither } from '../types';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain, tryCatch } from 'fp-ts/lib/TaskEither';
import { encrypt } from '../utils/encrypt';
import { badGateway } from '../utils/errors';
import { ObjectID } from 'mongodb';

const { PASSWORDS } = COLLECTIONS;

type O = ObjectID;

export const createPw = (db: DAO, user: O, pw: string, ec = encrypt): HTTPEither<O> => {
  return pipe(
    // encrypt the pw
    ec(pw),
    chain(password =>
      tryCatch(async () => {
        await db(PASSWORDS).insertOne({ password, user });
        return user;
      }, badGateway)
    )
  );
};
