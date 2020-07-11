import express, { json } from 'express';
import router from './controllers/';
import { Server } from 'http';
import cookies from 'cookie-parser';
import { log } from 'fp-ts/lib/Console';
import { fallback } from './middleware/fallback';

require('dotenv').config();
const PORT = Number(process.env.PORT);
const ENV = String(process.env.NODE_ENV);

const server = ((): Server => {
  const app = express();

  [cookies(), json(), router, fallback].forEach(mw => app.use(mw));

  return app.listen(PORT, log(`Port: ${PORT}\nEnv: ${ENV}`));
})();

process.on('unhandledRejection', () => {
  // TODO --> ping Sentry with rejection
  server.close(() => process.exit(1));
});

export default server;
