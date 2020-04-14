import User from '../models/user';
import asyncExpressFn from '../utils/asyncExpressFn';
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
  compareStrings,
  sendForgotPasswordEmail,
  catchForgotPasswordEmail,
  stageForPasswordResetRequest,
  resetPassword,
  clearDocumentsOfDeletedUser
} from './auth.functions';
import { findById, updateOne, deleteOne } from '../utils/daos';
import { Body } from '../types';
import { errorFactory } from '../utils/errorFactory';
import { BAD_REQUEST, OK, UNAUTHORIZED, NOT_FOUND } from 'http-status-codes';
import { responseFactory } from '../utils/responseFactory';

/*== changeEmail =====================================================

Allows an auth'd user to change their email

PUT /api/auth/user/email

*/

export const changeEmail = asyncExpressFn(async ({ body, id }, res, next) => {
  const creds = body as Body;

  if (!validateBody(creds, ['old', 'new', 'confirm'])) {
    return errorFactory(next, 'All fields required', BAD_REQUEST);
  }

  if (!compareStrings(creds.new, creds.confirm)) {
    return errorFactory(next, 'New and confirm must match', BAD_REQUEST);
  }

  // find the user with the validated id
  const user = (await findById(User, id)) as UserInterface;

  // confirm that the old email field matches the email on record
  if (!compareStrings(creds.old, user.email)) {
    return errorFactory(next, `Unauthorized`, UNAUTHORIZED);
  }

  await updateOne(User, { _id: id }, { email: body.confirm });

  return responseFactory(res, OK, true, { message: 'Email updated' });
});

/*== changePassword =====================================================

Allow's an auth'd user to change their password

PUT /api/auth/user/password

*/

export const changePassword = asyncExpressFn(
  async ({ body, id }, res, next) => {
    const creds = body as Body;

    if (!validateBody(creds, ['old', 'new', 'confirm'])) {
      return errorFactory(next, 'All fields required', BAD_REQUEST);
    }

    // confirm the new password and confirmed password do not match
    if (!compareStrings(creds.new, creds.confirm)) {
      return errorFactory(next, 'New and confirm must match', BAD_REQUEST);
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

export const deleteAccount = asyncExpressFn(async ({ id }, res) => {
  // delete the user
  await deleteOne(User, id);

  // delete every document that contains the user as a foreign key
  await clearDocumentsOfDeletedUser(id);

  return responseFactory(res, OK, true);
});

/*== forgotPassword =====================================================

Stages a forgot password process for an unauth'd user. Sends an email
that contains next steps

POST /api/auth/user/forgotpassword

*/

export const forgotPassword = asyncExpressFn(
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

export const changeForgottenPassword = asyncExpressFn(
  async ({ body, params: { id } }, res, next) => {
    const passwords = body as Body;

    // validate the body and confirm that the new password matches the confirm password
    if (!validateBody(passwords, ['newPassword', 'confirmPassword'])) {
      return errorFactory(next, 'All fields required', BAD_REQUEST);
    }

    if (!compareStrings(passwords.newPassword, passwords.confirmPassword)) {
      return errorFactory(next, 'New and confirm must match', BAD_REQUEST);
    }

    // reset the password. if this fails, return an error
    const user = await resetPassword(id, passwords.newPassword);

    if (!user) {
      return errorFactory(next, 'Invalid request', BAD_REQUEST);
    }

    // set a refresh token
    const refreshToken = tokenFactory(user._id, REFRESH_SECRET, REFRESH_EXPIRY);
    setRefreshToken(res, refreshToken);

    // set an auth token and return a response
    const authToken = tokenFactory(user._id, AUTH_SECRET, AUTH_EXPIRY);
    return responseFactory(res, OK, true, { token: authToken });
  }
);
