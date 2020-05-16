import { DAO } from '../index.types';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { HTTPEither, Nullable, Saved } from '../types';
import { badGateway } from '../utils/errors';
import { User } from '../controllers/users';

const { USERS } = COLLECTIONS;

type SU = Saved<User>;

export const readUser = (db: DAO, creds: Partial<SU>): HTTPEither<Nullable<SU>> => {
  return tryCatch(async (): Promise<Nullable<SU>> => await db(USERS).findOne(creds), badGateway);
};
