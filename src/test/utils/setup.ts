import mongoose from 'mongoose';
import wipe from './wipe';

require('dotenv').config();
before(async () => {
  mongoose.Promise = global.Promise;

  await mongoose.connect(process.env.DB!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  wipe();

  mongoose.connection.on('error', error => console.warn(error));
});
