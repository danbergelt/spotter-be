import { resolver } from '../../utils/resolver';
import { UserReq } from './users.types';
import { pipe } from 'fp-ts/lib/pipeable';
import { readUser } from '../../services/readUser';
import { chain, fold } from 'fp-ts/lib/TaskEither';
import { readPw } from '../../services/readPw';
import { of } from 'fp-ts/lib/Task';
import { auth } from '../../utils/auth';

export const login = resolver(async (req: UserReq, res, next) => {
  const { email, password } = req.body;
  const { db } = req.app.locals;

  return await pipe(
    readUser(db, { email }),
    chain(user => readPw(db, { ...user, password })),
    fold(
      error => of(next(error)),
      _id => auth(_id, res)
    )
  )();
});
