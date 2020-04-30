import { resolver } from '../../utils/resolver';
import { HTTPEither } from '../../types';
import { BAD_REQUEST } from 'http-status-codes';
import { chainEitherK, left, right, chain, fold } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { of } from 'fp-ts/lib/Task';
import { verifyToken } from '../../utils/verifyToken';
import { readUser } from '../../services/readUser';
import { ObjectId } from 'mongodb';
import { auth } from '../../utils/auth';
import { e } from '../../utils/e';

export const refresh = resolver(async ({ cookies, app }, res) => {
  const { db } = app.locals;

  // validates the existence of a refresh token
  const refresh = cookies.ref as string | null;

  return await pipe(
    ((): HTTPEither<string> => (!refresh ? left(e('_', BAD_REQUEST)) : right(refresh)))(),
    chainEitherK(verifyToken),
    chain(({ _id }) => readUser(db, { _id: new ObjectId(_id) })),
    fold(
      ({ status }) => {
        res.status(status).json({ success: false, token: null });
        return of(undefined);
      },
      ({ _id }) => auth(_id, res)
    )
  )();
});
