import { errorFactory } from '../../../../utils/errorFactory';
import Sinon from 'sinon';
import { expect } from 'chai';
import HttpError from 'src/utils/HttpError';

const next = Sinon.stub().returnsArg(0);

describe('error factory', () => {
  beforeEach(() => {
    next.resetHistory();
  });

  it('returns an error with default values', () => {
    const error = (errorFactory(next) as unknown) as HttpError;

    expect(error).to.be.a('error');
    expect(next.calledOnce).to.be.true;
    expect(error.status).to.equal(500);
    expect(error.message).to.equal('Server error');
  });

  it('returns an error with passed-in data', () => {
    const error = (errorFactory(next, 'foobar', 400) as unknown) as HttpError;

    expect(error).to.be.a('error');
    expect(next.calledOnce).to.be.true;
    expect(error.status).to.equal(400);
    expect(error.message).to.equal('foobar');
  });
});
