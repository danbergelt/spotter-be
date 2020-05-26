import { handler, loadQuery } from '../../../utils/pg';
import assert from 'assert';
import { badGateway } from '../../../utils/errors';
import Sinon from 'sinon';
import { right, left } from 'fp-ts/lib/Either';

describe('error handler', () => {
  it('returns a duplicate error', () => {
    const foo = handler({ code: '23505' });
    assert.deepStrictEqual(foo, { message: 'User already exists', status: 400 });
  });

  it('defaults to bad gateway', () => {
    const foo = handler({});
    assert.deepStrictEqual(foo, badGateway());
  });
});

describe('query', () => {
  it('queries and returns rows', async () => {
    const pool = { query: Sinon.stub().returns({ rows: ['foo'] }) };
    const foo = await loadQuery(pool as any)('some sql', ['foo'])();
    assert.deepStrictEqual(foo, right(['foo']));
  });

  it('returns an error if query fails', async () => {
    const pool = { query: Sinon.stub().throws('foo') };
    const foo = await loadQuery(pool as any)('some sql', ['foo'])();
    assert.deepStrictEqual(foo, left(badGateway()));
  });
});
