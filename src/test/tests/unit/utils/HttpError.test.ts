import HttpError from '../../../../utils/HttpError';
import { expect } from 'chai';

describe('custom http error', () => {
  it('returns an error', () => {
    const error = new HttpError('error', 500);
    expect(error).to.be.a('error');
    expect(error.message).to.equal('error');
    expect(error.status).to.equal(500);
  });
});
