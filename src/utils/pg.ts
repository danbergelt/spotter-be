import { Pool } from 'pg';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { badGateway } from '../utils/errors';
import { Async } from '../types';
import { Saved } from '../validators/decoders';

const { POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, DB, DB_PORT } = process.env;

const pool = new Pool({
  user: POSTGRES_USER,
  host: DB,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: Number(DB_PORT)
});

// load a DB query with the provided type, and return the rows
// TODO --> parse the PG error
export const loadQuery = <T>(p = pool) => <U>(sql: string, args: U[]): Async<Saved<T>[]> =>
  tryCatch(async () => (await p.query(sql, args)).rows, badGateway);
