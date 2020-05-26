export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const HEX_COLOR = /^#([a-f0-9]{3,4}|[a-f0-9]{4}(?:[a-f0-9]{2}){1,2})\b$/i;

// TODO --> either tighten up this regex or rely on a third party for "mmm dd yyyy"
export const DATE_REGEX = /[A-Z][a-z]{2} \d{2} \d{4}$/;

export const EMAILS = {
  CONTACT: 'contact@getspotter.io',
  NO_REPLY: 'no-reply@getspotter.io',
  TEAM: 'team@getspotter.io'
} as const;

// TODO --> confirm these are optimal for production
export const COOKIE_OPTIONS = {
  expires: new Date(Number(new Date()) + 604800000),
  httpOnly: process.env.NODE_ENV === 'development' ? false : true,
  secure: process.env.NODE_ENV === 'development' ? false : true,
  sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none'
} as const;

export const COOKIE_NAME = 'ref';

export const SQL = {
  REGISTER: 'insert into users (email, pw) values ($1, $2) returning id',
  LOGIN: 'select * from users where email = $1',
  AUTHENTICATE: 'select * from users where id = $1'
} as const;
