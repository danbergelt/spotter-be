import { digestToken } from '../../../utils/digestToken';
import Sinon from 'sinon';
import { left, right } from 'fp-ts/lib/Either';
import { left as taskLeft, right as taskRight } from 'fp-ts/lib/TaskEither';
import assert from 'assert';

describe('digest token', () => {
  it('returns a left on failed jwt verification', async () => {
    const d = { verifyJwt: Sinon.stub().returns(left('foo')) } as any;
    const db = Sinon.stub();
    const result = await digestToken('foo', db, 'secret', d)();
    const expected = left('foo');
    assert.deepStrictEqual(result, expected);
  });

  it('returns a left on failed mongofy', async () => {
    const d = {
      verifyJwt: Sinon.stub().returns(right({ _id: 'foo' })),
      mongofy: Sinon.stub().returns(left('bar'))
    } as any;
    const db = Sinon.stub();
    const result = await digestToken('foo', db, 'secret', d)();
    const expected = left('bar');
    assert.deepStrictEqual(result, expected);
  });

  it('returns left on failed user read', async () => {
    const d = {
      verifyJwt: Sinon.stub().returns(right({ _id: 'foo' })),
      mongofy: Sinon.stub().returns(right('bar')),
      readOne: Sinon.stub().returns(taskLeft('baz'))
    };
    const db = Sinon.stub();
    const result = await digestToken('foo', db, 'secret', d)();
    const expected = await taskLeft('baz')();
    assert.deepStrictEqual(result, expected);
  });

  it('returns left if user is null', async () => {
    const d = {
      verifyJwt: Sinon.stub().returns(right({ _id: 'foo' })),
      mongofy: Sinon.stub().returns(right('bar')),
      readOne: Sinon.stub().returns(taskRight(null))
    };
    const db = Sinon.stub();
    const result = await digestToken('foo', db, 'secret', d)();
    const expected = await taskLeft({ message: 'Unauthorized', status: 401 })();
    assert.deepStrictEqual(result, expected);
  });

  it('returns right if token is succcessfuly digestd', async () => {
    const d = {
      verifyJwt: Sinon.stub().returns(right({ _id: 'foo' })),
      mongofy: Sinon.stub().returns(right('bar')),
      readOne: Sinon.stub().returns(taskRight('baz'))
    };
    const db = Sinon.stub();
    const result = await digestToken('foo', db, 'secret', d)();
    const expected = await taskRight('baz')();
    assert.deepStrictEqual(result, expected);
  });
});
