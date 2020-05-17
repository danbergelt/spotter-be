import { Write } from '../types';

// parses a MongoDB write and returns the inserted document

export const parseWrite = <T>(write: Write<T>): T => write.ops[0];
