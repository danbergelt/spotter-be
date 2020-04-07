import { Document, Schema } from 'mongoose';

export interface Exercise extends Document {
  name: string;
  user: Schema.Types.ObjectId;
  createdAt: Date;
  pr: number;
  prDate: string;
}

// helper schema for the workout interface
export interface ExerciseOnWorkoutSchema {
  name: string;
  weight: number;
  sets: number;
  reps: number;
  _id: Schema.Types.ObjectId;
}

export interface Workout extends Document {
  _id: Schema.Types.ObjectId;
  date: string;
  createdAt?: Date;
  title: string;
  tags: Array<{ content: string; color: string; _id: Schema.Types.ObjectId }>;
  notes: string;
  exercises: Array<ExerciseOnWorkoutSchema>;
  user: Schema.Types.ObjectId;
}

export interface User extends Document {
  email: string;
  password: string;
  role: string;
  created: Date;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: number | undefined;
  getToken(): string;
  matchPassword(id: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

export interface Tag extends Document {
  color: string;
  content: string;
  user: Schema.Types.ObjectId;
}

export interface ExerciseOnTemplateSchema {
  name: string;
  weight: number;
  sets: number;
  reps: number;
}

export interface Template extends Document {
  name: string;
  createdAt: Date;
  title: string;
  tags: Array<{ content: string; color: string }>;
  notes: string;
  exercises: Array<ExerciseOnTemplateSchema>;
  user: typeof Schema.Types.ObjectId;
}
