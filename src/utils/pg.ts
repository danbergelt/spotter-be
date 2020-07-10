import { Pool } from 'pg';
import * as TE from 'fp-ts/lib/TaskEither';
import { badGateway } from '../utils/errors';
import { Async } from '../types';
import { Saved } from '../validators/decoders';
import { match } from 'io-ts-extra';
import { literal } from 'io-ts';
import { E } from './parsers';
import { pipe } from 'fp-ts/lib/pipeable';
import { DB_CONFIG } from './constants';

export type Data<T> = ReadonlyArray<Saved<T>>;

const pool = new Pool(DB_CONFIG);

// maps PG errors
type Handler = (error: unknown) => E;
export const handler: Handler = error =>
  match((error as { code: string }).code)
    //  TODO --> find a way to handle this generically
    .case(literal('23505'), () => badGateway)
    .default(() => badGateway)
    .get();

type Query = <T>(p?: Pool) => (sql: string) => <U>(args: U[]) => Async<Data<T>>;
export const query: Query = (p = pool) => sql => args =>
  pipe(
    TE.tryCatch(async () => await p.query(sql, args), handler),
    TE.map(q => q.rows)
  );
