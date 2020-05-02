import { string, array, object, number, mixed } from 'yup';
import { DATE_REGEX } from '../utils/constants';

export const workout = {
  date: string()
    .required('Workout date required')
    .test('date format', 'Invalid date', date => DATE_REGEX.test(date))
    .trim(),
  title: string()
    .required('Please add title')
    .max(25, 'Title too long (25 char max)')
    .trim(),
  tags: array()
    .typeError('Tags must be sent as array')
    .of(
      object()
        .typeError('Tag must be an object')
        .shape({
          content: string()
            .max(20, 'Tag too long (20 char max)')
            .trim(),
          color: string()
            .trim()
            .required('Tag must have a color')
        })
    ),
  notes: string().trim(),
  exercises: array()
    .typeError('Exercises must be sent as array')
    .of(
      object()
        .typeError('Exercise must be an object')
        .shape({
          name: string()
            .max(25, 'Exercise too long (25 char max)')
            .required('Exercise must have a name'),
          weight: number().max(2000, '2000 lb limit'),
          sets: number().max(2000, '2000 sets limit'),
          reps: number().max(2000, '2000 reps limit')
        })
    ),
  user: mixed().required('Workout must have a user ID')
};

export const user = {
  email: string()
    .email('Invalid email')
    .required('Email is required')
    .trim(),
  password: string()
    .min(6, 'Password too short (6 char minimum)')
    .required('Password is required')
    .trim()
} as const;

export const contact = {
  name: string()
    .required('Name is required')
    .trim(),
  email: string()
    .email('Invalid email')
    .required('Email is required')
    .trim(),
  subject: string()
    .required('Subject is required')
    .trim(),
  message: string()
    .required('Message is required')
    .trim()
} as const;

export const range = {
  range: array()
    .of(string().trim())
    .required('Please supply a date range')
} as const;
