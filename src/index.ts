import express, { json } from 'express';
import dotenv from 'dotenv';
import fns from './index.functions';
import users from './controllers/users';
import workouts from './controllers/workouts';
import { Server } from 'http';
import cookies from 'cookie-parser';
import { error } from './middleware/error';
import { MongoClient } from 'mongodb';
import { CONFIG, URI, COLLECTIONS } from './utils/constants';
import { DAO } from './index.types';

dotenv.config();
const { log } = console;
const { inject } = fns;
const { PORT, DB, NODE_ENV } = process.env;
const { USERS } = COLLECTIONS;

const server = ((): Server => {
  const app = express();

  MongoClient.connect(String(DB), CONFIG, (err, client) => {
    // bubble a failed connection --> want server to shut down in this case
    // TODO --> ping Sentry
    if (err) throw err;

    // idempotent --> only runs once
    client.db(URI).createIndex(USERS, { email: 1 }, { unique: true });

    // inject a Mongo DAO into global express stack
    app.locals.db = (collection => client.db(URI).collection(collection)) as DAO;

    return;
  });

  // inject N middleware
  inject(app)(cookies(), json(), users, workouts, error);

  return app.listen(Number(PORT), () => log(`Port: ${PORT}\nMode: ${NODE_ENV}`));
})();

process.on('unhandledRejection', rejection => {
  log(rejection);
  server.close(() => process.exit(1));
});

export default server;
