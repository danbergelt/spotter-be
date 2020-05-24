import { mapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { SyncEither } from '../types';
import { ExactC, TypeC } from 'io-ts';
import { parseValidationError } from '../utils/parsers';

// TODO --> need to fix the generic decoder type
export const validate = (decoder: ExactC<TypeC<any>>) => <T>(object: T): SyncEither<T> =>
  pipe(decoder.decode(object), mapLeft(parseValidationError));
