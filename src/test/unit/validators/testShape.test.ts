import { testShape } from '../../../validators/testShape';
import assert from 'assert';

describe('test an objects shape', () => {
  it('returns true on clean object', () => {
    const foo = { foo: 'bar' };
    const func = testShape(foo);
    const result = func({ foo: 'bar' });
    assert.ok(result);
  });

  it('returns false on a dirty object', () => {
    const foo = { foo: 'bar' };
    const func = testShape(foo);
    const result = func({ bar: 'bar' });
    assert.ok(!result);
  });
});
