export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const HEX_COLOR_REGEX = /^#([a-f0-9]{3,4}|[a-f0-9]{4}(?:[a-f0-9]{2}){1,2})\b$/i;
// TODO --> tighten up this regex, rely on a third party for "mmm dd yyyy", or store as a timestamp and manipulate on FE
export const DATE_REGEX = /[A-Z][a-z]{2} \d{2} \d{4}$/;

export const COOKIE_NAME = 'ref';

// TODO --> confirm these are optimal for production
const isDevEnv = process.env.NODE_ENV === 'development';
export const COOKIE_OPTIONS = {
  expires: new Date(Number(new Date()) + 604800000),
  httpOnly: !isDevEnv,
  secure: !isDevEnv,
  sameSite: isDevEnv ? 'lax' : 'none'
} as const;

// NOTE --> cannot use env vars with enums
export const DB_CONFIG = {
  user: String(process.env.POSTGRES_USER),
  host: String(process.env.DB),
  database: String(process.env.POSTGRES_DB),
  password: String(process.env.POSTGRES_PASSWORD),
  port: Number(process.env.DB_PORT)
} as const;

export enum EMAILS {
  CONTACT = 'contact@getspotter.io',
  NO_REPLY = 'no-reply@getspotter.io',
  TEAM = 'team@getspotter.io'
}

export enum SQL {
  REGISTER = 'insert into users (email, password) values ($1, $2) returning id',
  LOGIN = 'select * from users where email = $1',
  AUTHENTICATE = 'select * from users where id = $1'
}
