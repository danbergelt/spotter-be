import { concat } from 'ramda';

// builds a path with the format --> baseurl/collection/...rest

export const path = (c: string) => (p: string): string => concat(concat('/api/auth', c), p);
