import HttpError from '../utils/HttpError';
import User from '../models/user';
import crypto from 'crypto';
import controllerFactory from '../utils/controllerFactory';
import { User as UserInterface } from '../types/models';
import { setRefreshToken, tokenFactory } from '../utils/tokens';
import {
  REFRESH_SECRET,
  REFRESH_EXPIRY,
  AUTH_SECRET,
  AUTH_EXPIRY
} from '../utils/constants';
import {
  validateBody,
  mutatePassword,
  compare,
  sendForgotPasswordEmail,
  catchForgotPasswordEmail,
  stageForPasswordResetRequest
} from './auth.functions';
import { findById, updateOne, deleteOne } from '../utils/daos';
import { ResetUserDetailsBody } from '../types';
import { errorFactory } from '../utils/errorFactory';
import { BAD_REQUEST, OK, UNAUTHORIZED, NOT_FOUND } from 'http-status-codes';
import { responseFactory } from '../utils/responseFactory';

/*== changeEmail =====================================================

Allows an auth'd user to change their email

PUT /api/auth/user/email

*/

export const changeEmail = controllerFactory(
  async ({ body, id }, res, next) => {
    const creds = body as ResetUserDetailsBody;

    if (!validateBody(creds)) {
      return errorFactory(next, 'All fields required', BAD_REQUEST);
    }

    if (!compare(creds.new, creds.confirm)) {
      return errorFactory(next, 'Confirmed email does not match', BAD_REQUEST);
    }

    // find the user with the validated id
    const user = (await findById(User, id)) as UserInterface;

    // confirm that the old email field matches the email on record
    if (!compare(creds.old, user.email)) {
      return errorFactory(next, `Unauthorized`, UNAUTHORIZED);
    }

    await updateOne(User, { _id: id }, { email: body.confirm });

    return responseFactory(res, OK, true, { message: 'Email updated' });
  }
);

/*== changePassword =====================================================

Allow's an auth'd user to change their password

PUT /api/auth/user/password

*/

export const changePassword = controllerFactory(
  async ({ body, id }, res, next) => {
    const creds = body as ResetUserDetailsBody;

    if (!validateBody(creds)) {
      return errorFactory(next, 'All fields required', BAD_REQUEST);
    }

    // confirm the new password and confirmed password do not match
    if (!compare(creds.new, creds.confirm)) {
      return errorFactory(
        next,
        'Confirmed password does not match',
        BAD_REQUEST
      );
    }

    // attempt to change the user's password. if it fails, return an error
    if (!(await mutatePassword(id, creds.old, creds.new))) {
      return errorFactory(next, `Unauthorized`, UNAUTHORIZED);
    }

    return responseFactory(res, OK, true, { message: 'Password updated' });
  }
);

/*== deleteAccount =====================================================

Allows an auth'd user to permanently delete their account

DELETE /api/auth/user/delete

*/

export const deleteAccount = controllerFactory(async ({ id }, res) => {
  // delete the user
  await deleteOne(User, id);

  return responseFactory(res, OK, true);
});

/*== forgotPassword =====================================================

Stages a forgot password process for an unauth'd user. Sends an email
that contains next steps

POST /api/auth/user/forgotpassword

*/

export const forgotPassword = controllerFactory(
  async ({ body, protocol, hostname }, res, next) => {
    const email = body.email as string;

    // return a validated user and reset password token
    const data = await stageForPasswordResetRequest(email);

    // if the user could not be validated, return an error
    if (!data) return errorFactory(next, 'User not found', NOT_FOUND);

    const { user, token } = data;

    // create reset url
    const link = `${protocol}://${hostname}/-/${token}`;

    try {
      return await sendForgotPasswordEmail(body.email, link, res);
    } catch (_) {
      return catchForgotPasswordEmail(user, next);
    }
  }
);

// @desc --> change forgotten password
// @route --> PUT /api/auth/user/forgotpassword/:id
// @access --> Public

export const changeForgottenPassword = controllerFactory(
  async (req, res, next) => {
    // extract new password fields from body
    const {
      newPassword,
      confirmPassword
    }: { newPassword: string; confirmPassword: string } = req.body;

    // check that passwords match and that both fields exist
    if (!newPassword || !confirmPassword) {
      return next(new HttpError('All fields are required', 400));
    }
    if (newPassword !== confirmPassword) {
      return next(new HttpError('Fields must match', 400));
    }

    // get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.id)
      .digest('hex');

    // check for user with this token and a valid exp. date
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new HttpError('Invalid token', 404));
    }

    // reset the password, set auth fields to undefined
    user.password = newPassword;
    user.resetPasswordExpire = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    setRefreshToken(
      res,
      tokenFactory(user._id, REFRESH_SECRET, REFRESH_EXPIRY)
    );

    const authToken = tokenFactory(user._id, AUTH_SECRET, AUTH_EXPIRY);

    return res.status(200).json({ success: true, token: authToken });
  }
);
