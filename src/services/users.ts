import { Fn } from '../utils/wrap.types';
import { COLLECTIONS } from '../db/mongo.constants';

const { USERS } = COLLECTIONS;

export const register: Fn = async ({ body }, res, next) => {
  const user = await res.locals.db(USERS).insertOne({ email: 'foo', password: 'bar' });
  next();
};
