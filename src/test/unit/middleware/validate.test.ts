import { validate } from '../../../middleware/validate';
import { schema } from '../../../validators';
import { expect } from 'chai';
import Sinon from 'sinon';
import { SCHEMAS } from '../../../utils/constants';
import { mockRes } from 'sinon-express-mock';

describe('validating middleware', () => {
  it('returns a function', () => {
    const validator = validate(schema(SCHEMAS.USERS));
    expect(validator).to.be.a('function');
  });

  it('throws error on failed validation', async () => {
    const validator = validate(schema(SCHEMAS.USERS));
    const req = { body: { foo: 'bar' } } as any;
    const res = mockRes();
    const next = Sinon.stub();
    await validator(req, res, next);
    expect(res.json.calledWith({ success: false, error: 'Invalid data' })).to.be.true;
    expect(res.status.calledWith(400)).to.be.true;
  });

  it('calls next middleware on successful validation', async () => {
    const validator = validate(schema(SCHEMAS.USERS));
    const req = { body: { email: 'foo@bar.com', password: 'foobar' } } as any;
    const res = {} as any;
    const next = Sinon.stub();
    await validator(req, res, next);
    expect(next.firstCall.calledWith()).to.be.true;
  });
});
