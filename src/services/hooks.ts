import { tryCatch } from 'fp-ts/lib/TaskEither';
import { DAO } from '../index.types';
import { COLLECTION } from '../utils/constants';
import { badGateway } from '../utils/errors';
import { HTTPEither, Write, Saved, Nullable, Del } from '../types';

interface Hooks<T> {
  createOne: (db: DAO, document: T) => HTTPEither<Write<Saved<T>>>;
  readOne: (db: DAO, filter: Partial<Saved<T>>) => HTTPEither<Nullable<Saved<T>>>;
  deleteOne: (db: DAO, document: Partial<Saved<T>>) => HTTPEither<Del<Saved<T>>>;
  readMany: (db: DAO, filter: Partial<Saved<T>>) => HTTPEither<Saved<T>[]>;
}

export const hooks = <T>(collection: COLLECTION): Hooks<T> => {
  return {
    createOne: (db: DAO, document: T): HTTPEither<Write<Saved<T>>> =>
      tryCatch(async () => await db(collection).insertOne(document), badGateway),
    readOne: (db: DAO, filter: Partial<Saved<T>>): HTTPEither<Nullable<Saved<T>>> =>
      tryCatch(async () => await db(collection).findOne(filter), badGateway),
    deleteOne: (db: DAO, document: Partial<Saved<T>>): HTTPEither<Del<Saved<T>>> =>
      tryCatch(async () => db(collection).findOneAndDelete(document), badGateway),
    readMany: (db: DAO, filter: Partial<Saved<T>>): HTTPEither<Saved<T>[]> =>
      tryCatch(
        async () =>
          await db(collection)
            .find(filter)
            .toArray(),
        badGateway
      )
  };
};
