import {
  forgotPasswordTemplate,
  contactMessageTemplate,
  contactConfirmTemplate
} from '../../../utils/emailTemplates';
import assert from 'assert';

describe('email templates', () => {
  it('forgot password template', () => {
    const result = forgotPasswordTemplate('foobar');
    assert.ok(result.includes('<a href="foobar">foobar</a>'));
  });

  it('contact message template', () => {
    const result = contactMessageTemplate('foo', 'bar', 'baz');
    assert.ok(result.includes(`<div>Name: bar</div>`));
    assert.ok(result.includes(`<div>Email: baz</div>`));
    assert.ok(result.includes(`<div>Message: foo</div>`));
  });

  it('confirm contact message template', () => {
    const result = contactConfirmTemplate();
    assert.ok(result);
  });
});
