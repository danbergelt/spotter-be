import { resolver } from '../../utils/resolver';
import { UserReq } from './users.types';
import { pipe } from 'fp-ts/lib/pipeable';
import { createUser } from '../../services/createUser';
import { chain, fold } from 'fp-ts/lib/TaskEither';
import { createPw } from '../../services/createPw';
import { of } from 'fp-ts/lib/Task';
import { auth } from '../../utils/auth';

export const registration = resolver(async (req: UserReq, res, next) => {
  const { email, password } = req.body;
  const { db } = req.app.locals;

  return await pipe(
    createUser(db, email),
    chain(({ insertedId }) => createPw(db, insertedId, password)),
    fold(
      error => of(next(error)),
      _id => auth(_id, res)
    )
  )();
});
