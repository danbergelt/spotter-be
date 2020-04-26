import { COLLECTIONS } from '../db/mongo.constants';
import { tc } from '../utils/tc';
import { Agent } from '../db/mongo.types';
import { Res } from '../types';
import { BAD_GATEWAY } from 'http-status-codes';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain } from 'fp-ts/lib/TaskEither';
import { hash } from '../utils/hash';

const { PASSWORDS } = COLLECTIONS;

export const createPw = (db: Agent, user: string, password: string, h = hash): Res<string> => {
  return pipe(
    h(password),
    chain(password =>
      tc(async () => {
        await db(PASSWORDS).insertOne({ password, user });
        return user;
      })(BAD_GATEWAY)
    )
  );
};
