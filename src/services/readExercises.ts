import { tryCatch } from 'fp-ts/lib/TaskEither';
import { DAO } from '../index.types';
import { ObjectID } from 'mongodb';
import { COLLECTIONS } from '../utils/constants';
import { badGateway } from '../utils/errors';

const { EXERCISES } = COLLECTIONS;

export const readExercises = (db: DAO, user: ObjectID) => {
  return tryCatch(
    async () =>
      await db(EXERCISES)
        .find({ user })
        .toArray(),
    badGateway
  );
};
