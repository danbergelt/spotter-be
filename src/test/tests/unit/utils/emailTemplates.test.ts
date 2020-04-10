import {
  forgotPasswordTemplate,
  contactMessageTemplate,
  contactConfirmTemplate
} from '../../../../utils/emailTemplates';
import { expect } from 'chai';

describe('email templates', () => {
  it('returns a link in the forgot password template', () => {
    const template = forgotPasswordTemplate('foobar');
    expect(template.includes(`<a href="foobar">foobar</a>`)).to.be.true;
  });

  it('returns a contact message with the appropriate user info', () => {
    const template = contactMessageTemplate('foo', 'bar', 'baz');
    expect(template.includes(`<div>Name: bar</div>`)).to.be.true;
    expect(template.includes(`<div>Email: baz</div>`)).to.be.true;
    expect(template.includes(`<div>Message: foo</div>`)).to.be.true;
  });

  it('returns the static contact confirmation message', () => {
    const template = contactConfirmTemplate();
    expect(template).to.be.a('string');
  });
});
