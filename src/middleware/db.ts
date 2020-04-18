import { useMongo } from '../db/mongo';
import { wrap } from '../utils/wrap';
import { Fn } from 'src/utils/wrap.types';

// injects a database agent into the express stack

export const db = (dataLayer = useMongo, w = wrap): Fn => {
  return w(async (_req, { locals }, next) => {
    const { DB } = process.env;

    locals.db = await dataLayer(String(DB));

    next();
  });
};
