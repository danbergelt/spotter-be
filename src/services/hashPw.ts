import bcrypt from 'bcryptjs';
import { User } from './user.types';
import * as TE from 'fp-ts/lib/TaskEither';
import { tc } from '../utils/tc';

export const hashPw = (user: User): TE.TaskEither<Error, User> => {
  return tc(async () => {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(user.password, salt);
    return { ...user, password: hashed };
  });
};
