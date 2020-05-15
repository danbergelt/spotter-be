import { Write, Saved } from '../types';

// parses a MongoDB write and returns the inserted document

export const parseWrite = <T>(write: Write): Saved<T> => write.ops[0];
