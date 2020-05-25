import express, { json } from 'express';
import dotenv from 'dotenv';
import router from './controllers/';
import { Server } from 'http';
import cookies from 'cookie-parser';
import { fallback } from './middleware/fallback';

dotenv.config();
const { log } = console;
const { PORT, NODE_ENV } = process.env;

const server = ((): Server => {
  const app = express();
  [cookies(), json(), router, fallback].forEach(mw => app.use(mw));
  return app.listen(Number(PORT), () => log(`Port: ${PORT}\nMode: ${NODE_ENV}`));
})();

process.on('unhandledRejection', rejection => {
  log(rejection);
  server.close(() => process.exit(1));
});

export default server;
