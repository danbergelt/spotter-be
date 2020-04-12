import HttpError from '../utils/HttpError';
import User from '../models/user';
import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler';
import { User as UserInterface } from '../types/models';
import { sendMail } from '../utils/sendMail';
import { forgotPasswordTemplate } from '../utils/emailTemplates';
import { setRefreshToken, tokenFactory } from '../utils/tokens';
import {
  REFRESH_SECRET,
  REFRESH_EXPIRY,
  AUTH_SECRET,
  AUTH_EXPIRY
} from '../utils/constants';
import {
  validateBody,
  validateEmailWithPersistedEmail,
  mutatePassword
} from './auth.functions';
import { findById, updateOne, deleteOne } from '../utils/daos';
import { ResetUserDetailsBody } from '../types';
import { errorFactory } from '../utils/errorFactory';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import { responseFactory } from '../utils/responseFactory';

// @desc --> change password
// @route --> PUT /api/auth/user/email
// @access --> Private

export const changeEmail = asyncHandler(async ({ body, id }, res, next) => {
  // cast the body to match the context
  const creds = body as ResetUserDetailsBody;

  // validate the body object contains the proper fields
  if (!validateBody(creds)) {
    return errorFactory(next, 'Fields missing or mismatching', BAD_REQUEST);
  }

  // find the user with the validated id
  const user = (await findById(User, id)) as UserInterface;

  // confirm that the old email field matches the email on record
  if (!validateEmailWithPersistedEmail(creds.old, user.email)) {
    return errorFactory(next, `Invalid old email`, UNAUTHORIZED);
  }

  // update the user's email
  await updateOne(User, { _id: id }, { email: body.confirm });

  // return the response
  return responseFactory(res, OK, true, { message: 'Email updated' });
});

// @desc --> change password
// @route --> PUT /api/auth/user/password
// @access --> Private

export const changePassword = asyncHandler(async ({ body, id }, res, next) => {
  // cast the body to match the context
  const creds = body as ResetUserDetailsBody;

  // validate that the body contains the proper fields
  if (!validateBody(creds)) {
    return errorFactory(next, 'Fields missing or mismatching', BAD_REQUEST);
  }

  // match the password with the user's stored password
  if (!(await mutatePassword(id, creds.old, creds.new))) {
    return errorFactory(next, `Invalid old password`, UNAUTHORIZED);
  }

  // return the response
  return responseFactory(res, OK, true, { message: 'Password updated' });
});

// @desc --> delete account
// @route --> DELETE /api/auth/user/delete
// @access --> Private

export const deleteAccount = asyncHandler(async ({ id }, res) => {
  // delete the user
  await deleteOne(User, id);

  // return the response
  return responseFactory(res, OK, true);
});

// @desc --> forgot password
// @route --> POST /api/auth/user/forgotpassword
// @access --> Public

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new HttpError('No user found with that email', 404));
  }

  // get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetUrl: string =
    process.env.NODE_ENV === 'production'
      ? `https://www.getspotter.io/-/${resetToken}`
      : `http://localhost:3000/-/${resetToken}`;

  try {
    // send the message via Mailgun
    await sendMail({
      from: 'no-reply@getspotter.io',
      to: req.body.email,
      subject: 'Spotter - Forgot Password',
      html: forgotPasswordTemplate(resetUrl)
    });
    // if successful, return an object with the user
    return res.status(200).json({
      success: true,
      message: 'Email sent'
    });
  } catch (error) {
    // clear the reset field items on this user's document
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    // save the user, return an error message
    await user.save({ validateBeforeSave: false });
    return next(new HttpError('Email could not be sent', 500));
  }
});

// @desc --> change forgotten password
// @route --> PUT /api/auth/user/forgotpassword/:id
// @access --> Public

export const changeForgottenPassword = asyncHandler(async (req, res, next) => {
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

  setRefreshToken(res, tokenFactory(user._id, REFRESH_SECRET, REFRESH_EXPIRY));

  const authToken = tokenFactory(user._id, AUTH_SECRET, AUTH_EXPIRY);

  return res.status(200).json({ success: true, token: authToken });
});
