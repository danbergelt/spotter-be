import { authenticate } from '../../../services/authenticate';
import Sinon from 'sinon';
import assert from 'assert';
import { left, right } from 'fp-ts/lib/TaskEither';

describe('authenticator', () => {
  it('errors out if authorization header not found', async () => {
    const db = Sinon.stub();
    const digest = Sinon.stub();
    const req = { app: { locals: { db: Sinon.stub() } }, headers: {} } as any;
    const result = await authenticate(db, req, digest)();
    const expected = await left({ message: 'Unauthorized', status: 401 })();
    assert.deepStrictEqual(result, expected);
  });

  it('errors out if authorization header does not start with bearer', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'foobar' }
    } as any;
    const db = Sinon.stub();
    const digest = Sinon.stub();
    const result = await authenticate(db, req, digest)();
    const expected = await left({ message: 'Unauthorized', status: 401 })();
    assert.deepStrictEqual(result, expected);
  });

  it('errors out if token cannot be digested', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const foo = left({ message: 'Unauthorized', status: 401 });
    const db = Sinon.stub();
    const digest = Sinon.stub().returns(foo);
    const result = await authenticate(db, req, digest)();
    const expected = await left({ message: 'Unauthorized', status: 401 })();
    assert.deepStrictEqual(result, expected);
  });

  it('returns the authenticated body', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' },
      body: { foo: 'bar' }
    } as any;
    const db = Sinon.stub();
    const digest = Sinon.stub().returns(right({ _id: 'id' }));
    const result = await authenticate(db, req, digest)();
    const expected = await right({ foo: 'bar', user: 'id' })();
    assert.deepStrictEqual(result, expected);
  });
});
