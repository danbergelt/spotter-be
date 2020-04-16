import { concat } from 'ramda';

// concats a base url with a collection with a path
export const path = (c: string) => (p: string): string => concat(concat('/api/auth', c), p);
