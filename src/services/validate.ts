import { mapLeft } from 'fp-ts/lib/Either';
import { validationErr } from '../utils/errors';
import { pipe } from 'fp-ts/lib/pipeable';
import { SyncEither } from '../types';
import { ExactC, TypeC } from 'io-ts';

export const validate = <T>(decoder: ExactC<TypeC<any>>, object: T): SyncEither<T> =>
  pipe(
    decoder.decode(object),
    mapLeft(errors => validationErr(errors[0].message ? errors[0].message : 'Validation error'))
  );
