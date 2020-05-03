// all schema names
export const SCHEMAS = {
  USERS: 'USERS',
  CONTACT: 'CONTACT',
  RANGE: 'RANGE',
  WORKOUTS: 'WORKOUTS'
} as const;

export const HEX_REGEX = /^[0-9a-fA-f]{24}$/;

// TODO --> either tighten up this regex or rely on a third party for "mmm dd yyyy"
export const DATE_REGEX = /[A-Z][a-z]{2} \d{2} \d{4}$/;

export const EMAILS = {
  CONTACT: 'contact@getspotter.io',
  NO_REPLY: 'no-reply@getspotter.io',
  TEAM: 'team@getspotter.io'
} as const;

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
