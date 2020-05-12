import express, { json } from 'express';
import dotenv from 'dotenv';
import router from './controllers/';
import { Server } from 'http';
import cookies from 'cookie-parser';
import { fallback } from './middleware/fallback';
import { MongoClient } from 'mongodb';
import { CONFIG, URI, COLLECTIONS } from './utils/constants';
import { DAO } from './index.types';

dotenv.config();
const { log } = console;
const { PORT, DB, NODE_ENV } = process.env;
const { USERS } = COLLECTIONS;

const server = ((): Server => {
  const app = express();

  MongoClient.connect(String(DB), CONFIG, (err, client) => {
    // bubble a failed connection --> want server to shut down in this case
    // TODO --> ping Sentry
    if (err) throw err;

    // idempotent --> only runs once in collection lifetime
    client.db(URI).createIndex(USERS, { email: 1 }, { unique: true });

    // inject a Mongo DAO into global express stack
    app.locals.db = (collection => client.db(URI).collection(collection)) as DAO;
  });

  // inject N middleware
  [cookies(), json(), router, fallback].forEach(mw => app.use(mw));

  return app.listen(Number(PORT), () => log(`Port: ${PORT}\nMode: ${NODE_ENV}`));
})();

process.on('unhandledRejection', rejection => {
  log(rejection);
  server.close(() => process.exit(1));
});

export default server;
