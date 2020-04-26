import { COLLECTIONS } from '../utils/constants';
import { tc } from '../utils/tc';
import { Agent } from '../middleware/db.types';
import { HTTPEither } from '../types';
import { BAD_GATEWAY } from 'http-status-codes';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain } from 'fp-ts/lib/TaskEither';
import { hash } from '../utils/hash';

const { PASSWORDS } = COLLECTIONS;

export const createPw = (db: Agent, user: string, pw: string, h = hash): HTTPEither<string> => {
  return pipe(
    h(pw),
    chain(password =>
      tc(async () => {
        await db(PASSWORDS).insertOne({ password, user });
        return user;
      })(BAD_GATEWAY)
    )
  );
};
