import { forgotPw, confirmContactMsg, contactMsg } from '../../../utils/emailTemplates';
import assert from 'assert';

describe('email templates', () => {
  it('forgot password template', () => {
    const result = forgotPw('foobar');
    assert.ok(result.includes('<a href="foobar">foobar</a>'));
  });

  it('contact message template', () => {
    const result = contactMsg('foo', 'bar', 'baz');
    assert.ok(result.includes(`<div>Name: bar</div>`));
    assert.ok(result.includes(`<div>Email: baz</div>`));
    assert.ok(result.includes(`<div>Message: foo</div>`));
  });

  it('confirm contact message template', () => {
    const result = confirmContactMsg();
    assert.ok(result);
  });
});
