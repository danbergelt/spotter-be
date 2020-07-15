import { hasRows, query, handler, format } from '../../../utils/pg';
import { e } from '../../../utils/parsers';
import assert from 'assert';
import { right, left } from 'fp-ts/lib/TaskEither';
import Sinon from 'sinon';
import { badGateway } from '../../../utils/errors';

describe('hasRows', () => {
  it('validates that the raw query result has at least one row returned', async () => {
    const result = await hasRows(e('foo', 500))({ rows: [{ id: 1 }] } as any)();
    assert.deepStrictEqual(result, await right([{ id: 1 }])());
  });

  it('returns an error when the result returned no rows', async () => {
    const result = await hasRows(e('foo', 500))({ rows: [] } as any)();
    assert.deepStrictEqual(result, await left(e('foo', 500))());
  });
});

describe('query', () => {
  it('returns the query', async () => {
    const result = await query<string>({
      query: Sinon.stub().returns('foo')
    } as any)('bar', ['baz'])();
    assert.deepStrictEqual(result, await right('foo')());
  });

  it('returns an error if query fails', async () => {
    const result = await query<string>({
      query: Sinon.stub().throws('foo')
    } as any)('bar', ['baz'])();
    assert.deepStrictEqual(result, await left(badGateway)());
  });
});

describe('format', () => {
  it('formats a postgres table name', () => {
    const result = format('users');
    assert.equal(result, 'User');
  });
});

describe('handler', () => {
  it('returns a bad gateway error if no code exists', () => {
    assert.deepStrictEqual(handler({}), badGateway);
  });

  it('returns a custom duplicate resource error', () => {
    const result = handler({ code: '23505', table: 'foo' });
    const expected = { message: 'This foo already exists', status: 400 };
    assert.deepStrictEqual(result, expected);
  });

  it('returns the default error message for errors with uncaught cases', () => {
    const result = handler({ code: '234523' });
    const expected = badGateway;
    assert.deepStrictEqual(result, expected);
  });

  it('returns a custom duplicate resource error w/ no table name', () => {
    const result = handler({ code: '23505' });
    const expected = { message: 'This resource already exists', status: 400 };
    assert.deepStrictEqual(result, expected);
  });
});
