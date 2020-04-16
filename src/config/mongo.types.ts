import { Collection } from 'mongodb';

export type Accessor = (collection: string) => Collection;
