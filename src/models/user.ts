import { NextFunction } from 'connect';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from 'src/types/models';
import Exercise from './Exercise';
import Tag from './Tag';
import Template from './Template';
import Workout from './Workout';
import uniqueValidator from 'mongoose-unique-validator';

// User model

const UserSchema = new Schema<User>({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please add an email'],
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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

// Cascade remove a user's workouts on account close
UserSchema.post('findOneAndDelete', ({ _id }, next) => {
  Workout.deleteMany({ user: _id }, () => next());
});

// Cascade remove a user's exercises on account close
UserSchema.post('findOneAndDelete', ({ _id }, next) => {
  Exercise.deleteMany({ user: _id }, () => next());
});

// Cascade remove a user's templates on account close
UserSchema.post('findOneAndDelete', ({ _id }, next) => {
  Template.deleteMany({ user: _id }, () => next());
});

// Cascade remove a users' tags on account close
UserSchema.post('findOneAndDelete', ({ _id }, next) => {
  Tag.deleteMany({ user: _id }, () => next());
});

// Encrypt password on save
UserSchema.pre('save', async function(this: User, next: NextFunction) {
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

// Match password on login
UserSchema.methods.matchPassword = async function(
  pw: string
): Promise<boolean> {
  return await bcrypt.compare(pw, this.password);
};

// transform E11000 errors into validation errors (easier to wrangle)
UserSchema.plugin(uniqueValidator, { message: 'This email already exists' });

export default mongoose.model<User>('User', UserSchema);
