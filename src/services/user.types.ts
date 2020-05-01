import { ObjectID } from 'mongodb';

export interface Password {
  _id: string;
  password: string;
  user: string;
}

export interface Email {
  _id: string | ObjectID;
  email: string;
}

export type User = Email & Pick<Password, 'password'>;
