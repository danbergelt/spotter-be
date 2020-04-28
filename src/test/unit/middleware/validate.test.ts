import { validate } from '../../../middleware/validate';
import { SCHEMAS, schema } from '../../../validators';
import { expect } from 'chai';
import Sinon from 'sinon';

describe('validating middleware', () => {
  it('returns a functions', () => {
    const validator = validate(schema(SCHEMAS.USERS));
    expect(validator).to.be.a('function');
  });

  it('throws error on failed validation', async () => {
    const validator = validate(schema(SCHEMAS.USERS));
    const req = { body: { foo: 'bar' } } as any;
    const res = {} as any;
    const next = Sinon.stub();
    await validator(req, res, next);
    expect(next.firstCall.calledWith({ message: 'Email/password is required', status: 400 })).to.be
      .true;
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
