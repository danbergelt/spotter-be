import { protect } from '../../../middleware/protect';
import Sinon from 'sinon';
import assert from 'assert';
import { left, right } from 'fp-ts/lib/TaskEither';
import { mockRes } from 'sinon-express-mock';

describe('protect middleware', () => {
  it('errors out if authorization header not found', async () => {
    const v = Sinon.stub();
    const m = Sinon.stub();
    const r = Sinon.stub();
    const req = { app: { locals: { db: Sinon.stub() } }, headers: {} } as any;
    const res = mockRes();
    const next = Sinon.stub();
    const mw = protect(v, m, r);
    await mw(req, res, next);
    assert.ok(res.status.calledWithExactly(401));
    assert.ok(res.json.calledWithExactly({ success: false, error: 'Unauthorized' }));
  });

  it('errors out if authorization header does not start with bearer', async () => {
    const v = Sinon.stub();
    const m = Sinon.stub();
    const r = Sinon.stub();
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'foobar' }
    } as any;
    const res = mockRes();
    const next = Sinon.stub();
    const mw = protect(v, m, r);
    await mw(req, res, next);
    assert.ok(res.status.calledWithExactly(401));
    assert.ok(res.json.calledWithExactly({ success: false, error: 'Unauthorized' }));
  });

  it('errors out if token cannot be verified', async () => {
    const foo = await left({ message: 'foo', status: 401 })();
    const v = Sinon.stub().returns(foo);
    const m = Sinon.stub();
    const r = Sinon.stub();
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const res = mockRes();
    const next = Sinon.stub();
    const mw = protect(v, m, r);
    await mw(req, res, next);
    assert.ok(res.status.calledWithExactly(401));
    assert.ok(res.json.calledWithExactly({ success: false, error: 'foo' }));
  });

  it('errors out of object id cannot be mongoified', async () => {
    const foo = await left({ message: 'foo', status: 401 })();
    const bar = await right('foo')();
    const v = Sinon.stub().returns(bar);
    const m = Sinon.stub().returns(foo);
    const r = Sinon.stub();
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const res = mockRes();
    const next = Sinon.stub();
    const mw = protect(v, m, r);
    await mw(req, res, next);
    assert.ok(res.status.calledWithExactly(401));
    assert.ok(res.json.calledWithExactly({ success: false, error: 'foo' }));
  });

  it('errors out if user id cannot be authenticated', async () => {
    const foo = left({ message: 'foo', status: 401 });
    const bar = await right('foo')();
    const v = Sinon.stub().returns(bar);
    const m = Sinon.stub().returns(bar);
    const r = Sinon.stub().returns(foo);
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' }
    } as any;
    const res = mockRes();
    const next = Sinon.stub();
    const mw = protect(v, m, r);
    await mw(req, res, next);
    assert.ok(res.status.calledWithExactly(401));
    assert.ok(res.json.calledWithExactly({ success: false, error: 'foo' }));
  });

  it('calls next with no args and mutates the body on validation', async () => {
    const foo = await right('foo')();
    const bar = right({ _id: 'bar' });
    const v = Sinon.stub().returns(foo);
    const m = Sinon.stub().returns(foo);
    const r = Sinon.stub().returns(bar);
    const req = {
      app: { locals: { db: Sinon.stub() } },
      headers: { authorization: 'Bearer foobar' },
      body: { user: 'foo' }
    } as any;
    const res = {} as any;
    const next = Sinon.stub();
    const mw = protect(v, m, r);
    await mw(req, res, next);
    assert.ok(req.body.user === 'bar');
    assert.ok(next.calledWith());
  });
});
