import { DAO } from '../index.types';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { COLLECTIONS } from '../utils/constants';
import { HTTPEither, Nullable } from '../types';
import { Email } from './user.types';
import { badGateway } from '../utils/errors';

const { USERS } = COLLECTIONS;

export const readUser = (db: DAO, creds: Partial<Email>): HTTPEither<Nullable<Email>> => {
  return tryCatch(async (): Promise<Nullable<Email>> => await db(USERS).findOne(creds), badGateway);
};
