import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';

const { JWT_SECRET, JWT_EXPIRE } = process.env;

// generates an auth token

export const token = (_id: string | ObjectID, tokenFactory = jwt): string => {
  return tokenFactory.sign({ _id }, String(JWT_SECRET), {
    expiresIn: String(JWT_EXPIRE)
  });
};
