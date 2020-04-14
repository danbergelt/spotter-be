import { User as UserInterface } from '../types/models';
import { getPassword, findOne, deleteMany } from '../utils/daos';
import { UserStagedForPasswordReset, Body } from '../types';
import { sendMail } from '../utils/sendMail';
import { forgotPasswordTemplate } from '../utils/emailTemplates';
import { Response, NextFunction } from 'express';
import { responseFactory } from '../utils/responseFactory';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { errorFactory } from '../utils/errorFactory';
import User from '../models/user';
import crypto from 'crypto';
import { modelNames, model } from 'mongoose';

/*== compare =====================================================

Validate's two fields from the request body

*/

export const compareStrings = (a: string, b: string): boolean => a === b;

/*== validateBody =====================================================

Validates the body of an incoming request (i.e. change email or
change password). Accepts an array of keys, iterates over those keys,
and validates their existence in the body

*/

export const validateBody = (body: Body, keys: string[]): boolean => {
  for (const key of keys) {
    if (!body[key]) return false;
  }

  return true;
};

/*== passwordMutation =====================================================

Mutate a user's password. Must match the hashed password first. If no match, 
validation fails.

*/

export const mutatePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string,
  password = getPassword
): Promise<boolean> => {
  // select the password from the user
  const user = (await password(id)) as UserInterface;

  // match the provided password and the user's password
  const isMatch = await user.matchPassword(oldPassword);

  // if there's no match, return an error
  if (!isMatch) return false;

  // save the password to the user
  user.password = newPassword;

  await user.save();

  return true;
};

/*== stageForResetPassword =====================================================

This function stages a user to reset their password. It first validates a user
by email, and then generates a reset password token to send via email

*/

export const stageForPasswordResetRequest = async (
  email: string,
  findUserByEmail = findOne
): Promise<UserStagedForPasswordReset | false> => {
  // find the user by email
  const user = await findUserByEmail(User, { email });

  // if user can't be found, return an error
  if (!user) return false;

  // get reset token
  const token = user.getResetPasswordToken();

  // save the reset token to the user
  await user.save({ validateBeforeSave: false });

  return { user, token };
};

/*== sendForgotPasswordEmail =====================================================

Send the email to the user who forgot their password. Utilizes the mailgun API to
send a no-reply email from a spoof email address.

*/

export const sendForgotPasswordEmail = async (
  email: string,
  link: string,
  res: Response,
  sendingEmail = sendMail
): Promise<Response> => {
  // build metadata for sending the email
  const metadata = {
    from: 'no-reply@getspotter.io',
    to: email,
    subject: 'Spotter - Forgot Password',
    html: forgotPasswordTemplate(link)
  };

  // send the message via Mailgun
  await sendingEmail(metadata);

  // if successful, return an object with the user
  return responseFactory(res, OK, true, { message: 'Email sent' });
};

/*== catchForgotPasswordEmail =====================================================

The catch case if the forgot password email fails. Removes the reset items from this
user's document, saves the user, and returns an error

*/

export const catchForgotPasswordEmail = async (
  user: UserInterface,
  next: NextFunction,
  error = errorFactory
): Promise<void> => {
  // clear the reset items on this user's document
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // save the user with the cleared items
  await user.save({ validateBeforeSave: false });

  // return an error message
  return error(next, 'Email could not be sent', INTERNAL_SERVER_ERROR);
};

/*== resetPassword =====================================================

Reset a user's password

*/

export const resetPassword = async (
  id: string,
  newPassword: string,
  findUser = findOne
): Promise<false | UserInterface> => {
  // create a reset token with id arg to compare with the saved reset token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(id)
    .digest('hex');

  // validate user by token and expiry
  const FILTER = {
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  };

  const user = await findUser(User, FILTER);

  if (!user) return false;

  // reset the password, set auth fields to undefined
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // return the user
  return user;
};

/*== clearDocumentsOfDeletedUser =====================================================

Deletes all documents that are tied to a user when a user's account gets deleted

*/

export const clearDocumentsOfDeletedUser = async (
  user: string,
  getModelNames = modelNames,
  deleteDocs = deleteMany,
  getModel = model
): Promise<void> => {
  // get all the model names from the current mongoose instance
  for (const modelName of getModelNames()) {
    // iterate over them, and delete all documents tied to user
    await deleteDocs(getModel(modelName), { user });
  }
};
