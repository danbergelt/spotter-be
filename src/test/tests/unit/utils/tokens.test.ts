import { tokenFactory, setRefreshToken } from '../../../../utils/tokens';
import decode from 'jwt-decode';
import { expect } from 'chai';
import { mockRes } from 'sinon-express-mock';

describe('token helper functions', () => {
  it('signs and returns a token', () => {
    const token = tokenFactory('id', 'secret', '1h');
    expect(token).to.be.a('string');
    const metadata = decode(token) as any;
    expect(metadata.id).to.equal('id');
  });

  it('attaches a cookie to the response object', () => {
    const res = mockRes();
    setRefreshToken(res, tokenFactory('foo', 'bar', '1h'));

    expect(res.cookie.calledOnce).to.be.true;
  });
});
