import { tryCatch, chain, right, left, fromEither } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { Password, User } from './user.types';
import { HTTPEither, Nullable } from '../types';
import { DAO } from '../index.types';
import { pipe } from 'fp-ts/lib/pipeable';
import { verifyEncryption } from '../utils/verifiers';
import { ObjectID } from 'mongodb';
import { badGateway, invalidCredentials } from '../utils/errors';
import { fromNullable } from 'fp-ts/lib/Either';

const nullablePw = fromNullable(invalidCredentials());

const { PASSWORDS } = COLLECTIONS;

export const readPw = (db: DAO, user: User, v = verifyEncryption): HTTPEither<ObjectID> => {
  // find the password --> if null, return error, otherwise continue
  return pipe(
    tryCatch(
      async (): Promise<Nullable<Password>> => await db(PASSWORDS).findOne({ user: user._id }),
      badGateway
    ),
    chain(pw => fromEither(nullablePw(pw))),
    // validate the plaintext pw against the encrypted pw. if valid, return the user id, otherwise return error
    chain(({ password }) => v(user.password, password)),
    chain(validated => (validated ? right(user._id) : left(invalidCredentials())))
  );
};
