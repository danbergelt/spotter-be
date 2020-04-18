import { E } from './e.types';

// default error object, returning a message and an http status

export const e = (message: string, status: number): E => {
  return { message, status };
};
