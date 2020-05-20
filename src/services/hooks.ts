import { tryCatch } from 'fp-ts/lib/TaskEither';
import { DAO } from '../index.types';
import { COLLECTION } from '../utils/constants';
import { badGateway } from '../utils/errors';
import { HTTPEither, Write, Nullable, Del } from '../types';
import { Saved, Owned } from '../validators/decoders';

export type Entity<T> = Owned<Saved<T>>;

interface Hooks<T> {
  createOne: (db: DAO, document: Omit<T, '_id'>) => HTTPEither<Write<T>>;
  readOne: (db: DAO, filter: Partial<T>) => HTTPEither<Nullable<T>>;
  deleteOne: (db: DAO, document: Partial<T>) => HTTPEither<Del<T>>;
  readMany: (db: DAO, filter: Partial<T>) => HTTPEither<T[]>;
}

export const hooks = <T>(collection: COLLECTION): Hooks<T> => {
  return {
    createOne: <U>(db: DAO, document: U): HTTPEither<Write<T>> =>
      tryCatch(async () => await db(collection).insertOne(document), badGateway),
    readOne: (db: DAO, filter: Partial<T>): HTTPEither<Nullable<T>> =>
      tryCatch(async () => await db(collection).findOne(filter), badGateway),
    deleteOne: (db: DAO, document: Partial<T>): HTTPEither<Del<T>> =>
      tryCatch(async () => db(collection).findOneAndDelete(document), badGateway),
    readMany: (db: DAO, filter: Partial<T>): HTTPEither<T[]> =>
      tryCatch(
        async () =>
          await db(collection)
            .find(filter)
            .toArray(),
        badGateway
      )
  };
};
