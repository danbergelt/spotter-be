import HttpError from '../utils/HttpError';
import User from '../models/user';
import controllerFactory from '../utils/controllerFactory';
import { setRefreshToken, tokenFactory } from '../utils/tokens';
import jwt from 'jsonwebtoken';
import { User as UserInterface } from 'src/types/models';
import { Token } from '../types/auth';
import { Request, Response } from 'express';
import { sendMail } from '../utils/sendMail';
import {
  contactMessageTemplate,
  contactConfirmTemplate
} from '../utils/emailTemplates';
import {
  REFRESH_SECRET,
  REFRESH_EXPIRY,
  AUTH_EXPIRY,
  AUTH_SECRET
} from '../utils/constants';

interface UserDetails {
  email: string;
  password: string;
  role: string;
}

// @desc --> register user
// @route --> POST /api/auth/register
// @access --> Public

export const register = controllerFactory(async (req, res) => {
  const { email, password, role }: UserDetails = req.body;

  // create user
  const user: UserInterface = await User.create({
    email,
    password,
    role
  });

  setRefreshToken(res, tokenFactory(user._id, REFRESH_SECRET, REFRESH_EXPIRY));

  const authToken = tokenFactory(user._id, AUTH_SECRET, AUTH_EXPIRY);

  return res.status(201).json({ success: true, token: authToken });
});

// @desc --> login user
// @route --> POST /api/auth/login
// @access --> Public

export const login = controllerFactory(async (req, res, next) => {
  const { email, password }: Partial<UserDetails> = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new HttpError('Please provide an email and password', 400));
  }

  // Check for user
  const user: UserInterface | null = await User.findOne({ email }).select(
    '+password'
  );

  if (!user) {
    return next(new HttpError('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch: boolean = await user.matchPassword(password);

  if (!isMatch) {
    return next(new HttpError('Invalid credentials', 401));
  }

  setRefreshToken(res, tokenFactory(user._id, REFRESH_SECRET, REFRESH_EXPIRY));

  const authToken = tokenFactory(user._id, AUTH_SECRET, AUTH_EXPIRY);

  return res.status(200).json({ success: true, token: authToken });
});

// @desc --> logout
// @route --> POST /api/auth/logout
// @access --> Public

export const logout = (_: Request, res: Response): Response => {
  res.clearCookie('toll');

  return res.status(200).json({ success: true, data: 'Logged out' });
};

// @desc --> refresh token
// @route --> POST /api/auth/refresh
// @access --> Private

export const refresh = controllerFactory(async (req, res) => {
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

  setRefreshToken(res, tokenFactory(user._id, REFRESH_SECRET, REFRESH_EXPIRY));

  const authToken = tokenFactory(user._id, AUTH_SECRET, AUTH_EXPIRY);

  return res.status(200).json({ success: true, token: authToken });
});

// @desc --> contact
// @route --> POST /api/auth/contact
// @access --> Public

export const contact = controllerFactory(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return next(new HttpError('All fields are required', 400));
  }

  try {
    // confirmation message that message was sent
    await sendMail({
      from: 'no-reply@getspotter.io',
      to: email,
      subject: 'Greetings from Spotter',
      html: contactConfirmTemplate()
    });

    // contact message with user's message
    await sendMail({
      from: 'contact@getspotter.io',
      to: 'team@getspotter.io',
      subject,
      html: contactMessageTemplate(message, name, email)
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent'
    });
  } catch (error) {
    return next(new HttpError('Error sending message', 500));
  }
});
