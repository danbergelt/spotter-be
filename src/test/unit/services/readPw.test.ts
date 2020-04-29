import Sinon from 'sinon';
import { readPw } from '../../../services/readPw';
import { right, left } from 'fp-ts/lib/TaskEither';
import assert from 'assert';

describe('read a pw from the db', () => {
  it('reads a pw', async () => {
    const db = Sinon.stub().returns({ findOne: Sinon.stub().returns('foobar') });
    const user = { email: 'foo', password: 'bar', _id: 'baz' };
    const ve = Sinon.stub().returns(right(true));
    const result = await readPw(db, user, ve)();
    const expected = await right('baz')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error if pw cannot be found', async () => {
    const db = Sinon.stub().returns({ findOne: Sinon.stub().returns(null) });
    const user = { email: 'foo', password: 'bar', _id: 'baz' };
    const result = await readPw(db, user)();
    const expected = await left({ message: 'Invalid credentials', status: 400 })();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error id db errors out', async () => {
    const db = Sinon.stub().returns({ findOne: Sinon.stub().throws(new Error('foo')) });
    const user = { email: 'foo', password: 'bar', _id: 'baz' };
    const result = await readPw(db, user)();
    const expected = await left({ message: 'Bad gateway', status: 502 })();
    assert.deepStrictEqual(result, expected);
  });

  it('returns an error of encryption validator returns false', async () => {
    const db = Sinon.stub().returns({ findOne: Sinon.stub().returns('foobar') });
    const user = { email: 'foo', password: 'bar', _id: 'baz' };
    const ve = Sinon.stub().returns(right(false));
    const result = await readPw(db, user, ve)();
    const expected = await left({ message: 'Invalid credentials', status: 400 })();
    assert.deepStrictEqual(result, expected);
  });
});
