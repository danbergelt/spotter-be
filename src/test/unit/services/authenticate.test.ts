import { authenticate } from '../../../services/authenticate';
import Sinon from 'sinon';
import assert from 'assert';
import { left, right } from 'fp-ts/lib/TaskEither';
import { unauthorized } from '../../../utils/errors';
import { left as l, right as r } from 'fp-ts/lib/Either';

describe('authenticator', () => {
  it('errors out if authorization header not found', async () => {
    const deps = { verifyJwt: Sinon.stub(), query: Sinon.stub() };
    const req = { app: { locals: { db: Sinon.stub() } }, headers: {} } as any;
    const result = await authenticate(req, deps)();
    const expected = await left({ message: 'Unauthorized', status: 401 })();
    assert.deepStrictEqual(result, expected);
  });

  it('errors out if authorization header does not start with bearer', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'foobar' }
    } as any;
    const deps = { verifyJwt: Sinon.stub(), query: Sinon.stub() };
    const result = await authenticate(req, deps)();
    const expected = await left({ message: 'Unauthorized', status: 401 })();
    assert.deepStrictEqual(result, expected);
  });

  it('errors out if token cannot be verified', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const foo = l(unauthorized());
    const deps = { verifyJwt: Sinon.stub().returns(foo), query: Sinon.stub() };
    const result = await authenticate(req, deps)();
    assert.deepStrictEqual(result, foo);
  });

  it('errors out if query fails', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const foo = left(unauthorized());
    const bar = r({ id: 1 });
    const deps = { verifyJwt: Sinon.stub().returns(bar), query: Sinon.stub().returns(foo) };
    const result = await authenticate(req, deps)();
    assert.deepStrictEqual(result, await foo());
  });

  it('errors out if query returns null', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const bar = r({ id: 1 });
    const deps = { verifyJwt: Sinon.stub().returns(bar), query: Sinon.stub().returns(right([])) };
    const result = await authenticate(req, deps)();
    assert.deepStrictEqual(result, l(unauthorized()));
  });

  it('returns the authenticated body', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' },
      body: { foo: 'bar' }
    } as any;
    const deps = {
      verifyJwt: Sinon.stub().returns(r({ id: 1 })),
      query: Sinon.stub().returns(right([{ id: 1 }]))
    };
    const result = await authenticate(req, deps)();
    const expected = r({ foo: 'bar', user: 1 });
    assert.deepStrictEqual(result, expected);
  });
});
