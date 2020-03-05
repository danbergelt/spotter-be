import Err from '../utils/Err';
import User from '../models/user';
import crypto from 'crypto';
import asyncHandler from '../middleware/async';
import { User as UserInterface } from '../types/models';
import { sendMail, forgotPasswordTemplate } from '../utils/sendMail';
import { sendToken, refreshToken } from '../utils/tokens';
import { genToken } from '../utils/tokens';

type TUserDetails = Record<string, string>;

// @desc --> change password
// @route --> PUT /api/auth/user/password
// @access --> Private

export const changeEmail = asyncHandler(async (req, res, next) => {
  const { old, new: newE, confirm }: TUserDetails = req.body;

  // confirm that all fields are present
  if (!old || !newE || !confirm) {
    return next(new Err('All fields are required', 400));
  }

  // confirm that the user confirmed their new email and that the two fields match
  if (newE !== confirm) {
    return next(new Err('New email fields must match', 400));
  }

  const user: UserInterface | null = await User.findById(req.user._id);

  // confirm that the old email field matches the email on record
  if (old !== user?.email) {
    return next(new Err('Invalid credentials', 400));
  }

  // update the user's email
  await User.findByIdAndUpdate(
    req.user._id,
    { email: confirm },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Email updated'
  });
});

// @desc --> change password
// @route --> PUT /api/auth/user/password
// @access --> Private

export const changePassword = asyncHandler(async (req, res, next) => {
  // extract the user's input data
  const { old, new: newP, confirm }: TUserDetails = req.body;
  if (!old || !newP || !confirm) {
    return next(new Err('All fields are required', 400));
  }
  if (newP !== confirm) {
    return next(new Err('New password fields must match', 400));
  }

  // Check for user
  const user: UserInterface | null = await User.findById(req.user._id).select(
    '+password'
  );
  if (!user) {
    return next(new Err('User not found', 404));
  }

  // Check if password matches
  const isMatch: boolean = await user.matchPassword(old);
  if (!isMatch) {
    return next(new Err('Invalid credentials', 400));
  }

  // save the password to the user
  user.password = newP;
  await user.save();

  // return a success message after the user is updated
  res.status(200).json({
    success: true,
    message: 'Password updated'
  });
});

// @desc --> delete account
// @route --> DELETE /api/auth/user/delete
// @access --> Private

export const deleteAccount = asyncHandler(async (req, res) => {
  const user: UserInterface | null = await User.findById(req.user._id);

  // was not able to implement pre-hooks with deleteOne, so opting for remove() instead
  if (user) {
    await user.remove();
  }

  return res.status(200).json({
    success: true
  });
});

// @desc --> forgot password
// @route --> POST /api/auth/user/forgotpassword
// @access --> Public

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Err('No user found with that email', 404));
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
    await sendMail(
      'no-reply@getspotter.io',
      req.body.email,
      'Spotter - Forgot Password',
      forgotPasswordTemplate(resetUrl)
    );
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
    return next(new Err('Email could not be sent', 500));
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
    return next(new Err('All fields are required', 400));
  }
  if (newPassword !== confirmPassword) {
    return next(new Err('Fields must match', 400));
  }

  // get hashed token
  const resetPasswordToken: string = crypto
    .createHash('sha256')
    .update(req.params.id)
    .digest('hex');

  // check for user with this token and a valid exp. date
  const user: UserInterface | null = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new Err('Invalid token', 404));
  }

  // reset the password, set auth fields to undefined
  user.password = newPassword;
  user.resetPasswordExpire = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  refreshToken(
    res,
    genToken(
      user._id,
      process.env.REF_SECRET || 'unauthorized',
      process.env.REF_EXPIRE || '0d'
    )
  );

  return sendToken(user, 200, res);
});
