import { Success } from './success.types';

// default object for successful http responses

export const success = <T>(data: T): Success<T> => {
  return { success: true, ...data };
};
