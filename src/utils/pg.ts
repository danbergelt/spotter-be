import * as NEA from 'fp-ts/lib/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/lib/TaskEither';
import * as O from 'fp-ts/lib/Option';
import { Pool, QueryResult } from 'pg';
import { badGateway } from '../utils/errors';
import { Async } from '../types';
import { Saved } from '../validators/decoders';
import { E, e } from './parsers';
import { pipe } from 'fp-ts/lib/pipeable';
import { DB_CONFIG, CODES } from './constants';
import { Eq } from 'fp-ts/lib/Eq';
import { BAD_REQUEST } from 'http-status-codes';
import { flow } from 'fp-ts/lib/function';

type SQL = string;
type Code = keyof typeof CODES;
type PGError = { code: Code; table: string };
type Chunk<T> = QueryResult<Saved<T>>;
type Data<T> = NEA.ReadonlyNonEmptyArray<Saved<T>>;

// test equality between pg codes
const eqCode: Eq<Code> = {
  equals: (x, y) => x === y
};

// maps PG errors
type Handler = (error: unknown) => E;
const handler: Handler = flow(
  error => error as PGError,
  pgErr =>
    pipe(
      O.fromNullable(pgErr.code),
      O.fold(
        () => badGateway,
        code =>
          eqCode.equals(code, '23505')
            ? e(`This ${pgErr.table || 'resource'} already exists`, BAD_REQUEST)
            : badGateway
      )
    )
);

// checks if the query returned rows
type HasRows = (e: E) => <T>(c: Chunk<T>) => Async<Data<T>>;
const hasRows: HasRows = e => c =>
  pipe(
    NEA.fromArray(c.rows),
    TE.fromOption(() => e)
  );

const pool = new Pool(DB_CONFIG);

// postgres query
type Query = <T>(p?: Pool) => <U>(s: SQL, args: U[]) => Async<Chunk<T>>;
const query: Query = (p = pool) => (s, args) =>
  TE.tryCatch(async () => await p.query(s, args), handler);

export { Data, handler, hasRows, query };
