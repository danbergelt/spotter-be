import { Pool, QueryResult } from 'pg';
import * as TE from 'fp-ts/lib/TaskEither';
import * as F from 'fp-ts/lib/function';
import { badGateway } from '../utils/errors';
import { Async } from '../types';
import { Saved, User, Exercise, Tag, Workout } from '../validators/decoders';
import { match } from 'io-ts-extra';
import { literal } from 'io-ts';
import { E } from './parsers';
import { pipe } from 'fp-ts/lib/pipeable';
import { DB_CONFIG } from './constants';

type Result<T> = ReadonlyArray<
  Saved<
    T extends User
      ? User
      : T extends Exercise
      ? Exercise
      : T extends Tag
      ? Tag
      : T extends Workout
      ? Workout
      : unknown
  >
>;

const pool = new Pool(DB_CONFIG);

// maps PG errors
export const handler = (error: unknown): E =>
  match((error as { code: string }).code)
    //  TODO --> find a way to handle this generically
    .case(literal('23505'), () => badGateway)
    .default(F.constant(badGateway))
    .get();

type GetRows = <T>(q: QueryResult<T>) => Array<T>;
const getRows: GetRows = q => q.rows;

type Query<T> = <U>(sql: string, args: U[], p?: Pool) => Async<Result<T>>;
export const query: Query<unknown> = (sql, args, p = pool) =>
  pipe(
    TE.tryCatch(async () => await p.query(sql, args), handler),
    TE.map(getRows)
  );

export const userQuery: Query<User> = query;
