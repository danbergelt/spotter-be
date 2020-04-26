import { useMongo } from '../db/mongo';
import { wrap } from '../utils/wrap';
import { Fn } from '../utils/wrap.types';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { tc } from '../utils/tc';
import { BAD_GATEWAY } from 'http-status-codes';

// injects a database agent into the express stack

export const db = (dataLayer = useMongo, w = wrap): Fn => {
  return w(async (_req, { locals }, next) => {
    const { DB } = process.env;

    return await pipe(
      tc(async () => await dataLayer(String(DB)))(BAD_GATEWAY),
      fold(
        e => of(next(e)),
        agent => {
          // assign the db agent to res.locals for use down the stack
          locals.db = agent;
          return of(next());
        }
      )
    )();
  });
};
