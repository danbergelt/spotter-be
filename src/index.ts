import express, { json } from 'express';
import dotenv from 'dotenv';
import fns from './index.functions';
import users from './controllers/users';
import { Server } from 'http';
import cookies from 'cookie-parser';
import { error } from './middleware/error';
import { MongoClient } from 'mongodb';
import { CONFIG, URI, COLLECTIONS } from './utils/constants';
import { Agent } from './index.types';
dotenv.config();

const { success, logRejection, closeServer, inject } = fns;

const { PORT, DB } = process.env;

const { USERS } = COLLECTIONS;

const server = ((): Server => {
  const app = express();

  MongoClient.connect(String(DB), CONFIG, (err, client) => {
    // bubble a failed connection --> want server to shut down in this case
    // TODO --> ping Sentry
    if (err) throw err;

    client.db(URI).createIndex(USERS, { email: 1 }, { unique: true });

    // inject an 'agent' into express stack (single client for db connections)
    app.locals.db = (collection => client.db(URI).collection(collection)) as Agent;

    return;
  });

  // inject N middleware into our app
  inject(app)(cookies(), json(), users, error);

  return app.listen(Number(PORT), () => success());
})();

process.on('unhandledRejection', rejection => {
  logRejection(rejection);
  closeServer(server, process);
});
