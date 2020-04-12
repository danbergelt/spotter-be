import {
  validateBody,
  compare,
  mutatePassword,
  stageForPasswordResetRequest,
  sendForgotPasswordEmail,
  catchForgotPasswordEmail
} from '../../../../controllers/auth.functions';
import {
  ResetUserDetailsBody,
  UserStagedForPasswordReset
} from '../../../../types';
import { expect } from 'chai';
import Sinon from 'sinon';
import { mockRes } from 'sinon-express-mock';

describe('validateBody', () => {
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

  it('returns true if all conditions pass', () => {
    const body = { old: 'foo', new: 'bar', confirm: 'bar' };
    expect(validateBody(body)).to.be.true;
  });
});

describe('compare', () => {
  it('compare returns false if the strings do not match', () => {
    expect(compare('foo', 'bar')).to.be.false;
  });

  it('compare returns true if strings match', () => {
    expect(compare('foo', 'foo')).to.be.true;
  });
});

describe('changePassword', () => {
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

describe('stageForPasswordReset', () => {
  it('returns false if user cannot be found with provided email', async () => {
    const findOne = Sinon.stub().returns(null);
    const result = await stageForPasswordResetRequest('foobar', findOne);
    expect(result).to.be.false;
  });

  it('returns a user and a token on successful staging', async () => {
    const user = {
      save: Sinon.stub().returns('foo'),
      getResetPasswordToken: Sinon.stub().returns('token')
    };

    const findOne = Sinon.stub().returns(user);

    const result = await stageForPasswordResetRequest('foobar', findOne);
    expect((result as UserStagedForPasswordReset).user).to.deep.equal(user);
    expect((result as UserStagedForPasswordReset).token).to.equal('token');
  });
});

describe('sendForgotPasswordEmail', () => {
  it('returns a response when a forgot password email is sent', async () => {
    const sendMail = Sinon.stub().returnsThis();
    const res = mockRes();

    await sendForgotPasswordEmail('email', 'link', res, sendMail);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ success: true, message: 'Email sent' })).to.be
      .true;
  });
});

describe('catchForgotPasswordEmail', () => {
  it('returns an error when a forgot password email is sent', async () => {
    const user = {
      resetPasswordExpire: 'foo',
      resetPasswordToken: 'bar',
      save: Sinon.stub().returnsThis()
    } as any;

    const next = Sinon.stub().returnsArg(0);

    const error = Sinon.stub();

    await catchForgotPasswordEmail(user, next, error);

    expect(error.calledWith(next, 'Email could not be sent', 500)).to.be.true;
  });
});
