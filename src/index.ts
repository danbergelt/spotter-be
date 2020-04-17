import express, { json } from 'express';
import dotenv from 'dotenv';
import fns from './index.functions';
import users from './controllers/users';
import { db } from './middleware/db';
import { Server } from 'http';
import cookies from 'cookie-parser';
dotenv.config();

const { success, logRejection, closeServer, inject } = fns;

const { PORT } = process.env;

const server = ((): Server => {
  const app = express();

  // inject N number of middleware into our app
  inject(app, [db(), cookies(), json(), users]);

  return app.listen(Number(PORT), () => success());
})();

process.on('unhandledRejection', rejection => {
  logRejection(rejection);
  closeServer(server, process);
});
