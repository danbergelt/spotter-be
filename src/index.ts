import express, { json } from 'express';
import dotenv from 'dotenv';
import router from './controllers/';
import { Server } from 'http';
import cookies from 'cookie-parser';
import { log } from 'fp-ts/lib/Console';
import { fallback } from './middleware/fallback';
import { constant } from 'fp-ts/lib/function';

dotenv.config();
const PORT = Number(process.env.PORT);
const ENV = String(process.env.NODE_ENV);

const server = ((): Server => {
  const app = express();
  [cookies(), json(), router, fallback].forEach(mw => app.use(mw));
  return app.listen(Number(PORT), log(`Port: ${PORT}\nMode: ${ENV}`));
})();

process.on('unhandledRejection', () => {
  // TODO --> ping Sentry with rejection
  server.close(constant(process.exit(1)));
});

export default server;
