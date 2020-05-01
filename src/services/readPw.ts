import { tryCatch, chain, right, left } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { Password, User } from './user.types';
import { HTTPEither, Nullable } from '../types';
import { DAO } from '../index.types';
import { pipe } from 'fp-ts/lib/pipeable';
import { verifyEncryption } from '../utils/verifyEncryption';
import { ObjectID } from 'mongodb';
import { badGateway, invalidCredentials } from '../utils/errors';

const { PASSWORDS } = COLLECTIONS;

export const readPw = (db: DAO, user: User, v = verifyEncryption): HTTPEither<ObjectID> => {
  return pipe(
    tryCatch(
      async (): Promise<Nullable<Password>> => await db(PASSWORDS).findOne({ user: user._id }),
      badGateway
    ),
    chain(pw => (pw ? right(pw) : left(invalidCredentials()))),
    chain(({ password }) => v(user.password, password)),
    chain(validated => (validated ? right(user._id) : left(invalidCredentials())))
  );
};
