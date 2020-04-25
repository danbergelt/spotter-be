import { COLLECTIONS } from '../db/mongo.constants';
import { tc } from '../utils/tc';
import { Agent } from 'src/db/mongo.types';
import { Res } from '../types';
import { BAD_GATEWAY } from 'http-status-codes';
import * as P from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import { hash } from '../utils/hash';

const { PASSWORDS } = COLLECTIONS;

export const createPw = (db: Agent, user: string, password: string, h = hash): Res<string> => {
  return P.pipe(
    h(password),
    TE.chain(password =>
      tc(BAD_GATEWAY, async () => {
        await db(PASSWORDS).insertOne({ password, user });
        return user;
      })
    )
  );
};
