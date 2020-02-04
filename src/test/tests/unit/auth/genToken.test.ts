import { genToken } from '../../../../utils/tokens';
import jwtDecode from 'jwt-decode';
import assert from 'assert';

describe('token factory', () => {
  it('generates token based on args', () => {
    const token = genToken('100', 'secret', '1d');
    const { id, exp } = jwtDecode(token);
    assert(id == 100);
    //@ts-ignore
    assert(new Date(exp * 1000) - new Date(Date.now()) > 86399000);
  });
});
