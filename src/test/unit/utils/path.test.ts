import { path } from '../../../utils/path';
import { expect } from 'chai';

describe('path factory', () => {
  it('builds a path', () => {
    expect(path('/foo')('/bar')).to.equal('/api/auth/foo/bar');
  });
});
