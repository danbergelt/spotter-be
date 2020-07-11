import { toSpotter, toUser } from '../../../utils/metadata';
import { Contact } from '../../../validators/decoders';
import assert from 'assert';

const c: Contact = {
  name: 'foo',
  email: 'foo@bar.com' as any,
  subject: 'bar',
  message: 'baz'
};

describe('metadata builders', () => {
  it('builds a toSpotter metadata object', () => {
    const result = toSpotter(c);
    assert.ok(result.from === 'contact@getspotter.io');
    assert.ok(result.to === 'team@getspotter.io');
    assert.ok(result.subject === c.subject);
    assert.ok(
      result.html.includes(c.email) &&
        result.html.includes(c.name) &&
        result.html.includes(c.message)
    );
  });

  it('builds a toUser metadata object', () => {
    const result = toUser(c);
    assert.ok(result.from === 'no-reply@getspotter.io');
    assert.ok(result.to === c.email);
    assert.ok(result.subject === 'Hello from Spotter');
    assert.ok(result.html.includes('Team Spotter'));
  });
});
