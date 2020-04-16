import { Error } from './e.types';

export const e = (msg: string, status: number): Error => {
  return { msg, status };
};
