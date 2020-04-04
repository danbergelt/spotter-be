import mongoose from 'mongoose';

/*== DB Config =====================================================

Connects to a mongo instance. Access the database URI via the .env
file, and passes it in as the connection. If this doesn't exist,
it will just be a string of 'undefined'.

Then, for debugging purposes, we log the current environment,
the database name, and the staging environment variable

*/

// mongoose typing is wrong - need to extend the interface in order to get access to the host property
interface C extends mongoose.Connection {
  host: string;
}

export const connectDB = async (): Promise<void> => {
  const { connection } = await mongoose.connect(process.env.DB as string, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  // log the environment
  console.log('\x1b[36m%s\x1b[0m', `Environment: ${process.env.NODE_ENV}`);

  // log the database
  console.log('\x1b[32m%s\x1b[0m', `Database: ${(connection as C).host}`);

  // log if we are currently in the staging environment
  console.log('\x1b[33m%s\x1b[0m', `Staging: ${process.env.STAGING}`);
};
