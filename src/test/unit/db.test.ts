import { db } from '../../middleware/db';
import { expect } from 'chai';
import Sinon from 'sinon';
import { mockReq } from 'sinon-express-mock';

describe('db middleware', () => {
  it('returns a middleware function', () => {
    const test = db();
    expect(test).to.be.a('function');
  });

  it('sets the db to res.locals on a successful connection', async () => {
    const dataLayer = Sinon.stub().returns('foo');
    const wrap = Sinon.stub().returnsArg(0);
    const t = db(dataLayer, wrap);

    const req = mockReq();
    const res = { locals: {} } as any;
    const next = Sinon.stub();

    await t(req, res, next);

    expect(res.locals.db).to.equal('foo');
    expect(next.calledOnce).to.be.true;
  });
});
