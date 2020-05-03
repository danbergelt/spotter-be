import { ObjectID } from 'mongodb';
import { DAO } from '../index.types';
import { map, chain } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { readExercises } from './readExercises';

export const setPrs = (db: DAO, user: ObjectID) => {
  const pickNames = (exercises: { name: string }[]) => exercises.map(e => e.name);
  return pipe(readExercises(db, user), map(pickNames));
};
