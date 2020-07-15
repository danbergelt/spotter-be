import * as t from 'io-ts';
import * as b from './brands';

type Build = <T extends t.Mixed>(
  name: string,
  codec: T
) => t.IntersectionC<[t.StringC, T]>;
const build: Build = (name, codec) => t.intersection([b.str(name), codec]);

// user type
export const userDecoder = t.exact(
  t.type({
    email: build('Email', b.email),
    password: build('Password', b.password)
  })
);

// contact type
export const contactDecoder = t.exact(
  t.type({
    name: b.str('Name'),
    email: build('Email', b.email),
    subject: b.str('Subject'),
    message: b.str('Message')
  })
);

// // exercise type
// export const exerciseDecoder = t.exact(
//   t.type({
//     name: b.exercise,
//     pr: optional(b.workoutStat),
//     prDate: optional(b.strDate),
//     user: b.userId
//   })
// );

// // tag type
// export const tagDecoder = t.exact(b.tag);

// // raw workout type
// export const workoutDecoder = t.exact(
//   t.type({
//     date: b.strDate,
//     title: b.workoutTitle,
//     tags: optional(t.array(b.savedTag)),
//     notes: optional(b.str('Notes')),
//     user: b.userId,
//     exercises: optional(t.array(b.workoutExercise))
//   })
// );

// statically inferred types
export type User = t.TypeOf<typeof userDecoder>;
export type Contact = t.TypeOf<typeof contactDecoder>;
// export type Exercise = t.TypeOf<typeof exerciseDecoder>;
// export type Tag = t.TypeOf<typeof tagDecoder>;
// export type Workout = t.TypeOf<typeof workoutDecoder>;
export type Saved<T = {}> = { id: t.TypeOf<typeof b.id> } & T;
