import { Collection } from 'mongodb';

export type Agent = (collection: string) => Collection;
