import { pipe } from 'fp-ts/lib/pipeable';
import { chain, fromEither } from 'fp-ts/lib/TaskEither';
import { verifyJwt } from './jwt';
import { mongofy } from './parsers';
import { hooks } from '../services/hooks';
import { unauthorized } from './errors';
import { fromNullable } from 'fp-ts/lib/Either';
import { DAO } from '../index.types';
import { HTTPEither } from '../types';
import { COLLECTIONS } from './constants';
import { User, Saved } from '../validators/decoders';

const { readOne } = hooks<SU>(COLLECTIONS.USERS);
const deps = { mongofy, readOne, verifyJwt };
const isUserNull = fromNullable(unauthorized());

type SU = Saved<User>;

// accepts a JWT, and verifies its payload against a persisted user id
export const digestToken = (raw: string, db: DAO, sec: string, d = deps): HTTPEither<SU> =>
  pipe(
    fromEither(d.verifyJwt(raw, sec)),
    chain(jwt => fromEither(d.mongofy(jwt._id))),
    chain(_id => d.readOne(db, { _id })),
    chain(user => fromEither(isUserNull(user)))
  );
