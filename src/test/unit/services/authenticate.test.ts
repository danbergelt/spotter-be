import { authenticate } from '../../../services/authenticate';
import Sinon from 'sinon';
import assert from 'assert';
import { left, right } from 'fp-ts/lib/TaskEither';
import { unauthorized } from '../../../utils/errors';
import { left as l, right as r } from 'fp-ts/lib/Either';

describe('authenticator', () => {
  it('errors out if authorization header not found', async () => {
    const req = { app: { locals: { db: Sinon.stub() } }, headers: {} } as any;
    const result = await authenticate(req, Sinon.stub(), Sinon.stub())();
    const expected = await left({ message: 'Unauthorized', status: 401 })();
    assert.deepStrictEqual(result, expected);
  });

  it('errors out if authorization header does not start with bearer', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'foobar' }
    } as any;
    const result = await authenticate(req, Sinon.stub(), Sinon.stub())();
    const expected = await left({ message: 'Unauthorized', status: 401 })();
    assert.deepStrictEqual(result, expected);
  });

  it('errors out if token cannot be verified', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const foo = l(unauthorized());
    const result = await authenticate(
      req,
      Sinon.stub().returns(Sinon.stub().returns(foo)),
      Sinon.stub()
    )();
    assert.deepStrictEqual(result, foo);
  });

  it('errors out if query fails', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const foo = left(unauthorized());
    const bar = r({ id: 1 });
    const result = await authenticate(req, () => () => bar, Sinon.stub().returns(foo))();
    assert.deepStrictEqual(result, await foo());
  });

  it('errors out if query returns null', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const bar = r({ id: 1 });
    const result = await authenticate(
      req,
      Sinon.stub().returns(Sinon.stub().returns(bar)),
      Sinon.stub().returns(right([]))
    )();
    assert.deepStrictEqual(result, l(unauthorized()));
  });

  it('returns the authenticated body', async () => {
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' },
      body: { foo: 'bar' }
    } as any;
    const result = await authenticate(
      req,
      Sinon.stub().returns(Sinon.stub().returns(r({ id: 1 }))),
      Sinon.stub().returns(right([{ id: 1 }]))
    )();
    const expected = r({ foo: 'bar', user: 1 });
    assert.deepStrictEqual(result, expected);
  });
});
