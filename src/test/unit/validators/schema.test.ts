import { schema } from '../../../validators';
import assert from 'assert';

// TODO --> need to clean up these tests to identify the actual schema, not just a true result

describe('schema factory', () => {
  it('returns a schema for the users case', () => {
    const result = schema('USERS');
    assert.ok(result);
  });
});
