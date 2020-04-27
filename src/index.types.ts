import { RequestHandler, ErrorRequestHandler } from 'express';
import { COLLECTION } from './utils/constants.types';
import { Collection } from 'mongodb';

export type MW = RequestHandler | ErrorRequestHandler;

export type Agent = (collection: COLLECTION) => Collection;
