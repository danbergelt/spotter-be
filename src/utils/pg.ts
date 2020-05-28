import { Pool } from 'pg';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { badGateway, duplicate } from '../utils/errors';
import { Async } from '../types';
import { Saved } from '../validators/decoders';
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
// TODO --> need to make this safer, check that error has the code field first
export const handler = (error: any): E =>
  match(error.code)
    //  TODO --> find a way to handle this generically
    .case(literal('23505'), () => duplicate('User'))
    .default(badGateway)
    .get();

// load a DB query with the provided type, and return the rows
// TODO --> find a way to accept the return type without a type argument
export const loadQuery = <T>(p = pool) => <U>(sql: string, args: U[]): Async<Saved<T>[]> =>
  tryCatch(async () => (await p.query(sql, args)).rows, handler);
