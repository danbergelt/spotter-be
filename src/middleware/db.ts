import { useMongo } from '../db/mongo';
import { RequestHandler } from 'express';
import { wrap } from '../utils/wrap';

// injects a database agent into the express stack

export const db = (dataLayer = useMongo, w = wrap): RequestHandler => {
  return w(async (_req, { locals }, next) => {
    const { DB } = process.env;

    locals.db = await dataLayer(String(DB));

    next();
  });
};
