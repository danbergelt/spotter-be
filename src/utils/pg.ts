import { Pool } from 'pg';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { badGateway, duplicate } from '../utils/errors';
import { Async } from '../types';
import { Saved, User } from '../validators/decoders';
import { match } from 'io-ts-extra';
import { literal } from 'io-ts';
import { E } from './parsers';

const { POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, DB, DB_PORT } = process.env;

const pool = new Pool({
  user: POSTGRES_USER,
  host: DB,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: Number(DB_PORT)
});

// intercepts PG error codes and provides an appropriate response
export const handler = (error: unknown): E =>
  match((error as { code: string }).code)
    //  TODO --> find a way to handle this generically
    .case(literal('23505'), () => duplicate('User'))
    .default(badGateway)
    .get();

type Query<T> = <U>(sql: string, args: U[], p?: Pool) => Async<Saved<T>[]>;

export const query: Query<unknown> = (sql, args, p = pool) =>
  tryCatch(async () => (await p.query(sql, args)).rows, handler);

export const userQuery = query as Query<User>;
