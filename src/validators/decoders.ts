import * as t from 'io-ts';
import { optional } from 'io-ts-extra';
import * as i from './intersections';

// raw user type
export const userDecoder = t.exact(
  t.type({
    email: i.EmailString,
    password: i.PasswordString
  })
);

// raw contact type
export const contactDecoder = t.exact(
  t.type({
    name: i.isValidString('name'),
    email: i.EmailString,
    subject: i.isValidString('subject'),
    message: i.isValidString('message')
  })
);

// raw exercise type
export const exerciseDecoder = t.exact(
  t.type({
    name: i.ExerciseString,
    pr: optional(i.isValidNum('pr')),
    prDate: optional(i.DateString),
    user: i.UserId
  })
);

// raw tag type
export const tagDecoder = t.exact(i.Tag);

// raw workout type
export const workoutDecoder = t.exact(
  t.type({
    date: i.DateString,
    title: i.WorkoutTitleString,
    tags: optional(t.array(i.WorkoutTag)),
    notes: optional(i.isValidString('notes')),
    user: i.UserId,
    exercises: optional(t.array(i.WorkoutExercise))
  })
);

// foreign key
export const ownerDecoder = t.exact(t.type({ user: i.UserId }));

// primary key
export const savedDecoder = t.exact(t.type({ _id: i.PrimaryKey }));

// statically inferred types
export type User = t.TypeOf<typeof userDecoder>;
export type Contact = t.TypeOf<typeof contactDecoder>;
export type Exercise = t.TypeOf<typeof exerciseDecoder>;
export type Tag = t.TypeOf<typeof tagDecoder>;
export type Owned<T = {}> = t.TypeOf<typeof ownerDecoder> & T;
export type Saved<T = {}> = t.TypeOf<typeof savedDecoder> & T;
