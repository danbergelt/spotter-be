import express from 'express';
import dotenv from 'dotenv';
import fns from './index.functions';
import { useMongo } from './config/mongo';

// configure env variables
dotenv.config();

const { PORT, DB } = process.env;

const db = useMongo(String(DB));

const app = express();

const server = app.listen(Number(PORT) || 5000, () => fns.success());

process.on('unhandledRejection', rejection => {
  fns.logRejection(rejection);
  fns.closeServer(server, process);
});

export default db;
