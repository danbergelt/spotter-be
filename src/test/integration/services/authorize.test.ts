import { authorize } from '../../../services/authorize';
import { left, right } from 'fp-ts/lib/TaskEither';
import { unauthorized } from '../../../utils/errors';
import assert from 'assert';
import { tokenFactory } from '../../../utils/jwt';

const authSecret = String(process.env.AUTH_SECRET);
const authExp = String(process.env.AUTH_EXPIRE);

const bad = tokenFactory({ id: 100, sec: authSecret, exp: authExp });
const good = tokenFactory({ id: 1, sec: authSecret, exp: authExp });

describe('authorizer', () => {
  it('errors out if invalid jwt', async () => {
    const result = await authorize({
      headers: { authorization: 'Bearer foo' }
    } as any)();

    const expected = await left(unauthorized)();

    assert.deepStrictEqual(result, expected);
  });

  it('errors out if user cannot be found', async () => {
    const result = await authorize({
      headers: { authorization: `Bearer ${bad}` }
    } as any)();

    const expected = await left(unauthorized)();

    assert.deepStrictEqual(result, expected);
  });

  it('returns the authorized request body', async () => {
    const result = await authorize({
      headers: { authorization: `Bearer ${good}` }
    } as any)();

    const expected = await right({ user: 1 })();

    assert.deepStrictEqual(result, expected);
  });
});
