import { NextFunction } from 'connect';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { genToken } from '../utils/tokens';
import { User } from 'src/types/models';
import Exercise from './Exercise';
import Tag from './Tag';
import Template from './Template';
import Workout from './Workout';
// User model

const UserSchema = new Schema<User>({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please add an email'],
    match: [
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password needs to be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
  created: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// Cascade remove all models for this user on remove
UserSchema.pre('remove', async function(next) {
  // cascade delete every model with this user id attached
  await Exercise.deleteMany({ user: this._id });
  await Tag.deleteMany({ user: this._id });
  await Template.deleteMany({ user: this._id });
  await Workout.deleteMany({ user: this._id });
  next();
});

// Encrypt password on save
UserSchema.pre<User>('save', async function(next: NextFunction) {
  if (!this.isModified('password')) {
    next();
  }
  const salt: string = await bcrypt.genSalt(10);
  const newPassword: string = await bcrypt.hash(this.password, salt);
  this.password = newPassword;
});

// Generate and hash reset password token
UserSchema.methods.getResetPasswordToken = function(): string {
  // generate tokens
  const resetToken: string = crypto.randomBytes(20).toString('hex');

  // hash token and set to field on this user's model
  (this.resetPasswordToken as string) = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Sign token and return
UserSchema.methods.getToken = function(): string {
  return genToken(
    this._id,
    process.env.JWT_SECRET || 'unauthorized',
    process.env.JWT_EXPIRE || '0d'
  );
};

// Match password on login
UserSchema.methods.matchPassword = async function(
  pw: string
): Promise<boolean> {
  return await bcrypt.compare(pw, this.password);
};

export default mongoose.model<User>('User', UserSchema);
