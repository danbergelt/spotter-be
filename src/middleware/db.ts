import { Fn } from '../utils/wrap.types';
import { Express } from 'express';
import { MongoClient } from 'mongodb';
import { CONFIG, URI, COLLECTIONS } from '../utils/constants';
import { Agent } from './db.types';

const { connect } = MongoClient;

const { USERS } = COLLECTIONS;

// injects a database agent into the express stack
// not catching errors --> if DB connection fails, want error to bubble up and close server
// TODO --> need to call Sentry so we are alerted if a fatal DB connection error occurs

export const db = (app: Express): Fn => {
  return async (_req, _res, next): Promise<void> => {
    const { DB } = process.env;

    // open a connection to a mongodb instance
    const client = await connect(String(DB), CONFIG);

    // user email should be unique
    await client.db(URI).createIndex(USERS, { email: 1 }, { unique: true });

    const agent: Agent = collection => client.db(URI).collection(collection);

    // inject a DB agent into this express instance globally --> provides a singleton-esque way of connecting to Mongo
    app.locals.db = agent;

    return next();
  };
};
