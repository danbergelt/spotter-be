import { connectDB } from '../../../../config/db';
import { doesNotReject, rejects } from 'assert';

describe('db config', () => {
  it('connects to the db and does not throw', async () => {
    await doesNotReject(connectDB());
  });

  it('throws when DB URI is invalid', async () => {
    process.env.DB = undefined;
    await rejects(connectDB());
  });
});
