import { getToken } from '../../../../middleware/protect.functions';
import { Request } from 'express';
import { expect } from 'chai';

describe('get token', () => {
  it('returns null when no authorization header is present', () => {
    const token = getToken({ headers: {} } as Request);
    expect(token).to.equal(null);
  });

  it('returns null if auth token is not a bearer', () => {
    const token = getToken({ headers: { authorization: 'foobar' } } as Request);
    expect(token).to.equal(null);
  });

  it('returns the split token', () => {
    const token = getToken({
      headers: { authorization: 'Bearer token' }
    } as Request);
    expect(token).to.equal('token');
  });
});
