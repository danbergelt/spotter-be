import { ObjectId, ObjectID } from 'mongodb';
import { HEX_REGEX } from './constants';
import { left, right } from 'fp-ts/lib/Either';
import { e } from './e';
import { BAD_REQUEST } from 'http-status-codes';
import { SyncEither } from '../types';

// convert a 24 character hex string into a mongo ObjectID

export const mongoify = (_id: string): SyncEither<ObjectID> => {
  return HEX_REGEX.test(_id) ? right(new ObjectId(_id)) : left(e('Invalid ObjectId', BAD_REQUEST));
};
