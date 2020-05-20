import { mapLeft } from 'fp-ts/lib/Either';
import { validationErr } from '../utils/errors';
import { pipe } from 'fp-ts/lib/pipeable';
import { SyncEither } from '../types';
import { ExactC, TypeC } from 'io-ts';

// TODO --> need to fix the generic decoder type
export const validate = (decoder: ExactC<TypeC<any>>) => <T>(object: T): SyncEither<T> =>
  pipe(
    decoder.decode(object),
    mapLeft(([e]) => validationErr(e.message ? e.message : 'Validation error'))
  );
