import { ObjectID } from 'mongodb';

export interface Password {
  _id: ObjectID;
  password: string;
  user: string;
}

export interface Email {
  _id: ObjectID;
  email: string;
}

export type User = Email & Pick<Password, 'password'>;
