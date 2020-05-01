import { RequestHandler, ErrorRequestHandler } from 'express';
import { COLLECTION } from './utils/constants';
import { Collection } from 'mongodb';

export type MW = RequestHandler | ErrorRequestHandler;

export type DAO = (collection: COLLECTION) => Collection;
