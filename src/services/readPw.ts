import { tryCatch, chain, right, left } from 'fp-ts/lib/TaskEither';
import { e } from '../utils/e';
import { COLLECTIONS } from '../utils/constants';
import { BAD_REQUEST, BAD_GATEWAY } from 'http-status-codes';
import { Password, Email } from './user.types';
import { HTTPEither } from 'src/types';
import { DAO } from '../index.types';
import { pipe } from 'fp-ts/lib/pipeable';
import { validateEncryption } from '../utils/validateEncryption';

const { PASSWORDS } = COLLECTIONS;

type User = Email & Pick<Password, 'password'>;

export const readPw = (db: DAO, user: User, ve = validateEncryption): HTTPEither<string> => {
  return pipe(
    tryCatch(
      async (): Promise<null | Password> => await db(PASSWORDS).findOne({ user: user._id }),
      () => e('Bad gateway', BAD_GATEWAY)
    ),
    chain(pw => (pw ? right(pw) : left(e('Invalid credentials', BAD_REQUEST)))),
    chain(({ password }) => ve(user.password, password)),
    chain(validated => (validated ? right(user._id) : left(e('Invalid credentials', BAD_REQUEST))))
  );
};
