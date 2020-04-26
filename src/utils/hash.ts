import bcrypt from 'bcryptjs';
import { tc } from './tc';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Res } from '../types';

export const hash = (s: string, bc = bcrypt): Res<string> => {
  return tc(async () => {
    const salt = await bcrypt.genSalt(12);
    return await bc.hash(s, salt);
  })(INTERNAL_SERVER_ERROR);
};
