import Err from '../utils/Err';
import User from '../models/user';
import asyncHandler from '../utils/asyncHandler';
import {
  refreshToken,
  genToken,
  clearRefreshToken,
  sendToken
} from '../utils/tokens';
import jwt from 'jsonwebtoken';
import { User as UserInterface } from 'src/types/models';
import { Token } from '../types/auth';
import { Request, Response } from 'express';
import {
  sendMail,
  contactMessageTemplate,
  contactConfirmTemplate
} from '../utils/sendMail';

interface UserDetails {
  email: string;
  password: string;
  role: string;
}

// @desc --> register user
// @route --> POST /api/auth/register
// @access --> Public

export const register = asyncHandler(async (req, res) => {
  const { email, password, role }: UserDetails = req.body;

  // create user
  const user: UserInterface = await User.create({
    email,
    password,
    role
  });

  refreshToken(
    res,
    genToken(
      user._id,
      process.env.REF_SECRET || 'unauthorized',
      process.env.REF_EXPIRE || '0d'
    )
  );

  sendToken(user, 201, res);
});

// @desc --> login user
// @route --> POST /api/auth/login
// @access --> Public

export const login = asyncHandler(async (req, res, next) => {
  const { email, password }: Partial<UserDetails> = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new Err('Please provide an email and password', 400));
  }

  // Check for user
  const user: UserInterface | null = await User.findOne({ email }).select(
    '+password'
  );

  if (!user) {
    return next(new Err('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch: boolean = await user.matchPassword(password);

  if (!isMatch) {
    return next(new Err('Invalid credentials', 401));
  }

  refreshToken(
    res,
    genToken(
      user._id,
      process.env.REF_SECRET || 'unauthorized',
      process.env.REF_EXPIRE || '0d'
    )
  );

  sendToken(user, 200, res);
});

// @desc --> logout
// @route --> POST /api/auth/logout
// @access --> Public

export const logout = (_: Request, res: Response): Response => {
  clearRefreshToken(res);

  return res.status(200).json({ success: true, data: 'Logged out' });
};

// @desc --> refresh token
// @route --> POST /api/auth/refresh
// @access --> Private

export const refresh = asyncHandler(async (req, res) => {
  const token: string | null = req.cookies.toll;

  if (!token) {
    return res.send({ success: false, token: null });
  }

  let payload: string | object;

  try {
    payload = jwt.verify(token, process.env.REF_SECRET || 'unauthorized');
  } catch (_) {
    return res.send({ success: false, token: null });
  }

  // refresh token is valid and we can send back new access token
  const user: UserInterface | null = await User.findOne({
    _id: (payload as Token).id
  });

  if (!user) {
    return res.send({ success: false, token: null });
  }

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

// @desc --> contact
// @route --> POST /api/auth/contact
// @access --> Public

export const contact = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return next(new Err('All fields are required', 400));
  }

  try {
    // confirmation message that message was sent
    await sendMail(
      'no-reply@getspotter.io',
      email,
      'Greetings from Spotter',
      contactConfirmTemplate()
    );

    // contact message with user's message
    await sendMail(
      'contact@getspotter.io',
      'team@getspotter.io',
      subject,
      contactMessageTemplate(message, name, email)
    );

    return res.status(200).json({
      success: true,
      message: 'Message sent'
    });
  } catch (error) {
    return next(new Err('Error sending message', 500));
  }
});
