import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectDB } from './config/db';
import errorHandler from './middleware/error';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
dotenv.config();

// Route imports
import users from './routes/users';
import workouts from './routes/workouts';
import tags from './routes/tags';
import templates from './routes/templates';
import auth from './routes/auth';
import exercises from './routes/exercises';
import { Server } from 'http';
import Err from './utils/Err';

const whitelist: Array<string> = [];

const app: Express = express();

// Connect to DB and run server
if (process.env.NODE_ENV === 'development') {
  connectDB();
}

if (process.env.NODE_ENV === 'production' && Boolean(process.env.STAGING)) {
  connectDB();
  app.use(cors());
} else if (process.env.NODE_ENV === 'production') {
  connectDB();
  whitelist.push('https://getspotter.io');
  // CORS custom config
  app.use(
    cors({
      origin: (origin, res) => {
        if (origin && whitelist.includes(origin)) {
          res(null, true);
        } else {
          res(new Err('Not allowed by CORS', 400));
        }
      },
      credentials: true
    })
  );
}

// Cookie parser
app.use(
  [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/user/forgotPassword/:id',
    '/api/auth/logout',
    '/api/auth/refresh'
  ],
  cookieParser()
);

// Dev logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

// NoSQL sanitization
app.use(mongoSanitize());

// Security headers
app.use(helmet());

// XSS protection
app.use(xss());

// Rate limiting
const limit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500
});

app.use(limit);

// Prevent HTTP param pollution
app.use(hpp());

// Routes
app.use('/api/auth', users);
app.use('/api/auth/workouts', workouts);
app.use('/api/auth/tags', tags);
app.use('/api/auth/templates', templates);
app.use('/api/auth/user', auth);
app.use('/api/auth/exercises', exercises);

// Error handling
app.use(errorHandler);

const port: number = Number(process.env.PORT) || 5000;

const server: Server = app.listen(port, () =>
  console.log(`Server started on port ${port} IN ${process.env.NODE_ENV} mode`)
);

// Unhandled rejection handling

const handleRejectedPromise = function(
  reason: Error | any, // eslint-disable-line
  promise: Promise<any> // eslint-disable-line
): void {
  console.log('Unexpected exception occured.', { reason, ex: promise });

  server.close(() => process.exit(1));
};

process.on('unhandledRejection', handleRejectedPromise);
