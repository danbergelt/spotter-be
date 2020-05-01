export const URI = 'spotter';

export const CONFIG = {
  useUnifiedTopology: true
} as const;

export const COLLECTIONS = {
  USERS: 'users',
  TEMPLATES: 'templates',
  WORKOUTS: 'workouts',
  TAGS: 'tags',
  EXERCISES: 'exercises',
  PASSWORDS: 'passwords'
} as const;

export const COOKIE_OPTIONS = {
  expires: new Date(Number(new Date()) + 604800000),
  httpOnly: process.env.NODE_ENV === 'development' ? false : true,
  secure: process.env.NODE_ENV === 'development' ? false : true,
  sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none'
} as const;

export const COOKIE_NAME = 'ref';

export type COLLECTION = typeof COLLECTIONS[keyof typeof COLLECTIONS];
