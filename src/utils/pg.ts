import { Pool, QueryResult } from 'pg';
import * as TE from 'fp-ts/lib/TaskEither';
import { badGateway } from '../utils/errors';
import { Async } from '../types';
import { Saved } from '../validators/decoders';
import { match } from 'io-ts-extra';
import { literal } from 'io-ts';
import { E } from './parsers';
import { pipe } from 'fp-ts/lib/pipeable';
import { DB_CONFIG } from './constants';
import {
  ReadonlyNonEmptyArray,
  fromArray
} from 'fp-ts/lib/ReadonlyNonEmptyArray';

type SQL = string;
export type Data<T> = ReadonlyNonEmptyArray<Saved<T>>;

const pool = new Pool(DB_CONFIG);

// maps PG errors
type Handler = (error: unknown) => E;
export const handler: Handler = error =>
  match((error as { code: string }).code)
    //  TODO --> find a way to handle this generically
    .case(literal('23505'), () => badGateway)
    .default(() => badGateway)
    .get();

// checks if the query returned rows
type HasRows = (e: E) => <T>(q: QueryResult<Saved<T>>) => Async<Data<T>>;
const hasRows: HasRows = e => q =>
  pipe(
    fromArray(q.rows),
    TE.fromOption(() => e)
  );

type Query = <T>(e: E, p?: Pool) => <U>(s: SQL, args: U[]) => Async<Data<T>>;
export const query: Query = (e, p = pool) => (s, args) =>
  pipe(
    TE.tryCatch(async () => await p.query(s, args), handler),
    TE.chain(hasRows(e))
  );
