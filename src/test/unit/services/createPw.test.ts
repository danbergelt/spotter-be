import { createPw } from '../../../services/createPw';
import Sinon from 'sinon';
import { left, right } from 'fp-ts/lib/TaskEither';
import assert from 'assert';

describe('create a password', () => {
  it('returns the user id on successful password creation', async () => {
    const db = Sinon.stub().returns({ insertOne: Sinon.stub() });
    const user = 'user';
    const pw = 'pw';
    const ec = Sinon.stub().returns(right('ENCRYPTED'));
    const result = await createPw(db, user, pw, ec)();
    const expected = await right('user')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error on failed password creation', async () => {
    const db = Sinon.stub().returns({ insertOne: Sinon.stub().throws(new Error('Error!')) });
    const user = 'user';
    const pw = 'pw';
    const ec = Sinon.stub().returns(right('ENCRYPTED'));
    const result = await createPw(db, user, pw, ec)();
    const expected = await left({ message: 'Error!', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });
});
