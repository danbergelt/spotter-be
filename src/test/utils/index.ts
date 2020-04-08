import express from 'express';
import dotenv from 'dotenv';
import errorHandler from '../../middleware/errorHandler';

dotenv.config();

// Route imports
import users from '../../routes/users';
import workouts from '../../routes/workouts';
import tags from '../../routes/tags';
import templates from '../../routes/templates';
import auth from '../../routes/auth';
import exercises from '../../routes/exercises';

// Connect to DB and run server
const app = express();

// Body parser
app.use(express.json());

// Routes
app.use('/api/auth', users);
app.use('/api/auth/workouts', workouts);
app.use('/api/auth/tags', tags);
app.use('/api/auth/templates', templates);
app.use('/api/auth/user', auth);
app.use('/api/auth/exercises', exercises);

// Error handling
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server ${`FOR TESTING`} started on port ${port}`)
);

// Unhandled rejection handling
process.on('unhandledRejection', () => {
  server.close(() => process.exit(1));
});

module.exports = app;
