import { tryCatch } from 'fp-ts/lib/TaskEither';
import { DAO } from '../index.types';
import { COLLECTION } from '../utils/constants';
import { badGateway } from '../utils/errors';
import { HTTPEither, Write, Nullable, Del } from '../types';
import { Saved } from 'src/validators/decoders';

/*

In this context hooks represent commonly used DB access functions, such as insertion,
deletion, reading, etc. 

The hooks wrapper function returns an object with all methods,
and accepts 1 type argument to map the expected data shape for each method, and
1 argument to provide the methods a collection

*/

/* 

Filters allow us to query our db for documents that match a certain pattern
aside from createOne (which accepts a plain document), all other methods accept
a filter, which can be any number of fields from a saved document 

*/
type Filter<T> = Partial<Saved<T>>;

interface Hooks<T> {
  createOne: (db: DAO, document: T) => HTTPEither<Write<Saved<T>>>;
  readOne: (db: DAO, filter: Filter<T>) => HTTPEither<Nullable<Saved<T>>>;
  deleteOne: (db: DAO, filter: Filter<T>) => HTTPEither<Del<Saved<T>>>;
  readMany: (db: DAO, filter: Filter<T>) => HTTPEither<Saved<T>[]>;
}

export const hooks = <T>(collection: COLLECTION): Hooks<T> => {
  return {
    createOne: (db: DAO, document: T): HTTPEither<Write<Saved<T>>> =>
      tryCatch(async () => await db(collection).insertOne(document), badGateway),
    readOne: (db: DAO, filter: Filter<T>): HTTPEither<Nullable<Saved<T>>> =>
      tryCatch(async () => await db(collection).findOne(filter), badGateway),
    deleteOne: (db: DAO, filter: Filter<T>): HTTPEither<Del<Saved<T>>> =>
      tryCatch(async () => db(collection).findOneAndDelete(filter), badGateway),
    readMany: (db: DAO, filter: Filter<T>): HTTPEither<Saved<T>[]> =>
      tryCatch(
        async () =>
          await db(collection)
            .find(filter)
            .toArray(),
        badGateway
      )
  };
};
