import { readUser } from '../../../services/readUser';
import Sinon from 'sinon';
import { right, left } from 'fp-ts/lib/TaskEither';
import assert from 'assert';

describe('read a user from the db', () => {
  it('reads a user', async () => {
    const db = Sinon.stub().returns({ findOne: Sinon.stub().returns('user') });
    const email = 'email';
    const result = await readUser(db, email)();
    const expected = await right('user')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if db query fails', async () => {
    const db = Sinon.stub().returns({ findOne: Sinon.stub().throws('foo') });
    const email = 'email';
    const result = await readUser(db, email)();
    const expected = await left({ message: 'Bad gateway', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if email cannot be found', async () => {
    const db = Sinon.stub().returns({ findOne: Sinon.stub().returns(null) });
    const email = 'email';
    const result = await readUser(db, email)();
    const expected = await left({ message: 'Invalid credentials', status: 400 })();
    assert.deepStrictEqual(result, expected);
  });
});
