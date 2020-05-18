import { mapLeft, left } from 'fp-ts/lib/Either';
import { validationErr, serverError } from '../utils/errors';
import { pipe } from 'fp-ts/lib/pipeable';
import * as D from 'io-ts/lib/Decoder';
import { SyncEither } from '../types';

export const validate = <T>(decoder: D.Decoder<T> | null, object: T): SyncEither<T> =>
  !decoder
    ? left(serverError())
    : pipe(
        decoder.decode(object),
        mapLeft(errors => validationErr(errors[0].forest[0].value))
      );
