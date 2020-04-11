import {
  validateBody,
  validateEmailWithPersistedEmail,
  mutatePassword
} from '../../../../controllers/auth.functions';
import { ResetUserDetailsBody } from 'src/types';
import { expect } from 'chai';
import Sinon from 'sinon';

describe('auth functions', () => {
  it('validateBody returns false if not all keys are present', () => {
    const one = {} as ResetUserDetailsBody;
    expect(validateBody(one)).to.be.false;

    const two = { old: 'foo' } as ResetUserDetailsBody;
    expect(validateBody(two)).to.be.false;

    const three = { old: 'foo', new: 'bar' } as ResetUserDetailsBody;
    expect(validateBody(three)).to.be.false;

    const four = { old: 'foo', confirm: 'bar' } as ResetUserDetailsBody;
    expect(validateBody(four)).to.be.false;

    const five = { new: 'bar', confirm: 'bar' } as ResetUserDetailsBody;
    expect(validateBody(five)).to.be.false;

    const six = { new: 'bar' } as ResetUserDetailsBody;
    expect(validateBody(six)).to.be.false;

    const seven = { confirm: 'bar' } as ResetUserDetailsBody;
    expect(validateBody(seven)).to.be.false;
  });

  it('validateBody returns false if new and confirm fields do not match', () => {
    const body = { old: 'foo', new: 'bar', confirm: 'baz' };
    expect(validateBody(body)).to.be.false;
  });

  it('returns true if all conditions pass', () => {
    const body = { old: 'foo', new: 'bar', confirm: 'bar' };
    expect(validateBody(body)).to.be.true;
  });

  it('email validator returns false if the strings do not match', () => {
    expect(validateEmailWithPersistedEmail(['foo', 'bar'])).to.be.false;
  });

  it('email validator returns true if strings match', () => {
    expect(validateEmailWithPersistedEmail(['foo', 'foo'])).to.be.true;
  });

  it('changePassword returns false when passwords do not match', async () => {
    const id = 'foo';
    const oldPassword = 'bar';
    const newPassword = 'baz';
    const user = { matchPassword: Sinon.stub().returns(false) };
    const stub = Sinon.stub().returns(user);
    const result = await mutatePassword(id, oldPassword, newPassword, stub);
    expect(result).to.be.false;
  });

  it('changePassword returns true on successful mutation', async () => {
    const id = 'foo';
    const oldPassword = 'bar';
    const newPassword = 'baz';
    const user = {
      matchPassword: Sinon.stub().returns(true),
      save: Sinon.stub().returnsThis(),
      password: ''
    };
    const stub = Sinon.stub().returns(user);
    const result = await mutatePassword(id, oldPassword, newPassword, stub);
    expect(result).to.be.true;
  });
});
