import { wrap } from '../utils/wrap';
import { ObjectSchema } from 'yup';
import { Fn } from '../utils/wrap.types';
import { e } from '../utils/e';
import { tc } from '../utils/tc';
import { BAD_REQUEST } from 'http-status-codes';

export const vdate = (schema: ObjectSchema): Fn => {
  return wrap(async ({ body }, _res, next) => {
    await tc(() => schema.validate(body))(error => next(e(error, BAD_REQUEST)));
    next();
  });
};
