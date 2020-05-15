import { DAO } from '../index.types';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { HTTPEither, Nullable, Saved } from '../types';
import { badGateway } from '../utils/errors';
import { User } from 'src/controllers/users';
const { USERS } = COLLECTIONS;

export const readUser = (db: DAO, email: string): HTTPEither<Nullable<Saved<User>>> => {
  return tryCatch(
    async (): Promise<Nullable<Saved<User>>> => await db(USERS).findOne({ email }),
    badGateway
  );
};
