const isDevEnv = process.env.NODE_ENV === 'development';

const expires = new Date(Number(new Date()) + 604800000);
const httpOnly = !isDevEnv;
const secure = !isDevEnv;
const sameSite = isDevEnv ? 'lax' : 'none';

const user = String(process.env.POSTGRES_USER);
const host = String(process.env.DB);
const database = String(process.env.POSTGRES_DB);
const password = String(process.env.POSTGRES_PASSWORD);
const port = Number(process.env.DB_PORT);

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const HEX_COLOR_REGEX = /^#([a-f0-9]{3,4}|[a-f0-9]{4}(?:[a-f0-9]{2}){1,2})\b$/i;
// TODO --> tighten up this regex, rely on a third party for "mmm dd yyyy", or store as a timestamp and manipulate on FE
export const DATE_REGEX = /[A-Z][a-z]{2} \d{2} \d{4}$/;

export const COOKIE_NAME = 'ref';

// TODO --> confirm these are optimal for production
export const COOKIE_OPTIONS = {
  expires,
  httpOnly,
  secure,
  sameSite
} as const;

// NOTE --> cannot use env vars with enums
export const DB_CONFIG = {
  user,
  host,
  database,
  password,
  port
} as const;

export enum EMAILS {
  CONTACT = 'contact@getspotter.io',
  NO_REPLY = 'no-reply@getspotter.io',
  TEAM = 'team@getspotter.io'
}

export enum SQL {
  REGISTER = 'insert into users (email, pw) values ($1, $2) returning id',
  LOGIN = 'select * from users where email = $1',
  AUTHENTICATE = 'select * from users where id = $1'
}
