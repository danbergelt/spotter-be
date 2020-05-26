import {
  invalidCredentials,
  badGateway,
  _,
  serverError,
  unauthorized,
  duplicate
} from '../../../utils/errors';
import assert from 'assert';

describe('reusable error objects', () => {
  it('invalid credentials', () => {
    const result = invalidCredentials();
    assert.deepStrictEqual(result, { message: 'Invalid credentials', status: 400 });
  });

  it('bad gateway', () => {
    const result = badGateway();
    assert.deepStrictEqual(result, { message: 'Bad gateway', status: 502 });
  });

  it('_', () => {
    const result = _();
    assert.deepStrictEqual(result, { message: '_', status: 400 });
  });

  it('server error', () => {
    const result = serverError();
    assert.deepStrictEqual(result, { message: 'Server error', status: 500 });
  });

  it('unauthorized', () => {
    const result = unauthorized();
    assert.deepStrictEqual(result, { message: 'Unauthorized', status: 401 });
  });

  it('duplicate', () => {
    const result = duplicate('foo');
    assert.deepStrictEqual(result, { message: 'foo already exists', status: 400 });
  });
});
