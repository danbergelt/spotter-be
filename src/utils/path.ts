import { semigroupString as S } from 'fp-ts/lib/Semigroup';

// builds a path with the format --> baseurl/collection/...rest

export const path = (c: string) => (p: string): string => S.concat(S.concat('/api/auth', c), p);
