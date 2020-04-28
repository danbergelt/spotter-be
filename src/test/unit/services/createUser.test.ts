import { createUser } from '../../../services/createUser';
import Sinon from 'sinon';
import { right, left } from 'fp-ts/lib/TaskEither';
import assert from 'assert';

describe('user creation', () => {
  it('creates a user', async () => {
    const db = Sinon.stub().returns({ insertOne: Sinon.stub().returns('user') });
    const email = 'foo@bar.com';
    const result = await createUser(db, email)();
    const expected = await right('user')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error on failed user creation', async () => {
    const db = Sinon.stub().returns({ insertOne: Sinon.stub().throws(new Error('Error!')) });
    const email = 'foo@bar.com';
    const result = await createUser(db, email)();
    const expected = await left({ message: 'Error!', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });
});