import * as t from 'io-ts';
import * as b from './brands';
import { optional } from 'io-ts-extra';

// user type
export const userDecoder = t.exact(t.type({ email: b.email, pw: b.pw }));

// contact type
export const contactDecoder = t.exact(
  t.type({
    name: b.isStr('Name'),
    email: b.email,
    subject: b.isStr('Subject'),
    message: b.isStr('Message')
  })
);

// exercise type
export const exerciseDecoder = t.exact(
  t.type({
    name: b.exercise,
    pr: optional(b.workoutStat),
    prDate: optional(b.strDate),
    user: b.userId
  })
);

// tag type
export const tagDecoder = t.exact(b.tag);

// raw workout type
export const workoutDecoder = t.exact(
  t.type({
    date: b.strDate,
    title: b.workoutTitle,
    tags: optional(t.array(b.savedTag)),
    notes: optional(b.isStr('Notes')),
    user: b.userId,
    exercises: optional(t.array(b.workoutExercise))
  })
);

// statically inferred types
export type User = t.TypeOf<typeof userDecoder>;
export type Contact = t.TypeOf<typeof contactDecoder>;
export type Exercise = t.TypeOf<typeof exerciseDecoder>;
export type Tag = t.TypeOf<typeof tagDecoder>;
export type Workout = t.TypeOf<typeof workoutDecoder>;
export type Owned<T = {}> = { user: t.TypeOf<typeof b.userId> } & T;
export type Saved<T = {}> = { id: t.TypeOf<typeof b.id> } & T;
