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

export const CODES = {
  '23505': 'duplicate',
  '08003': 'connection_does_not_exist',
  '08006': 'connection_failure',
  '2F002': 'modifying_sql_data_not_permitted',
  '57P03': 'cannot_connect_now',
  '42601': 'syntax_error',
  '42501': 'insufficient_privilege',
  '42602': 'invalid_name',
  '42622': 'name_too_long',
  '42939': 'reserved_name',
  '42703': 'undefined_column',
  '42000': 'syntax_error_or_access_rule_violation',
  '42P01': 'undefined_table',
  '42P02': 'undefined_parameter'
} as const;

export enum SQL {
  REGISTER = 'insert into users (email, password) values ($1, $2) returning id',
  LOGIN = 'select * from users where email = $1',
  AUTHENTICATE = 'select * from users where id = $1'
}
