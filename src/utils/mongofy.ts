import { ObjectId, ObjectID } from 'mongodb';
import { left, right } from 'fp-ts/lib/Either';
import { e } from './e';
import { BAD_REQUEST } from 'http-status-codes';
import { SyncEither } from '../types';

const { isValid } = ObjectId;

// convert a 24 character hex string into a mongo ObjectID

export const mongofy = (_id: string): SyncEither<ObjectID> =>
  isValid(_id) ? right(new ObjectId(_id)) : left(e('Invalid resource id', BAD_REQUEST));
