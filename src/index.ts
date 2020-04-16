import express from 'express';
import dotenv from 'dotenv';
import fns from './index.functions';
import users from './controllers/users';
import { db } from './middleware/db';

dotenv.config();

const { PORT } = process.env;

const { success, logRejection, closeServer, inject } = fns;

const app = express();

// inject N number of middleware into our app
inject(app, [db(), users]);

const server = app.listen(Number(PORT), () => success());

process.on('unhandledRejection', rejection => {
  logRejection(rejection);
  closeServer(server, process);
});

export default db;
