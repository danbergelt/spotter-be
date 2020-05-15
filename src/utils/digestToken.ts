import { pipe } from 'fp-ts/lib/pipeable';
import { chain, fromEither } from 'fp-ts/lib/TaskEither';
import { verifyJwt } from './verifiers';
import { mongofy } from './mongofy';
import { readUser } from '../services/readUser';
import { unauthorized } from './errors';
import { fromNullable } from 'fp-ts/lib/Either';
import { DAO } from '../index.types';
import { HTTPEither, Saved } from '../types';
import { User } from '../controllers/users';

const { REF_SECRET } = process.env;
const deps = { mongofy, readUser, verifyJwt };
const isUserNull = fromNullable(unauthorized());

// accepts a JWT, and verifies its payload against a persisted user id
export const digestToken = (raw: string, db: DAO, d = deps): HTTPEither<Saved<User>> => {
  const { mongofy, readUser, verifyJwt } = d;
  return pipe(
    fromEither(verifyJwt(raw, String(REF_SECRET))),
    chain(jwt => fromEither(mongofy(jwt._id))),
    chain(_id => readUser(db, { _id })),
    chain(user => fromEither(isUserNull(user)))
  );
};
