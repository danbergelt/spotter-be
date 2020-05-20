import * as t from 'io-ts';
import { DATE_REGEX, EMAIL_REGEX } from 'src/utils/constants';
import { ObjectID } from 'mongodb';

// empty symbols to map our custom types onto

interface StringDate {
  readonly Date: unique symbol;
}

interface Id {
  readonly Id: unique symbol;
}

interface Email {
  readonly Email: unique symbol;
}

interface PW {
  readonly PW: unique symbol;
}

interface Ex {
  readonly Ex: unique symbol;
}

// the branded types

export const StringDate = t.brand(
  t.string,
  (d): d is t.Branded<string, StringDate> => DATE_REGEX.test(d),
  'Date'
);

// TODO --> need to fix this type, io-ts cannot match actual ObjectIDs with the branded version (causing lots of typecasting)
export const OId = t.brand(
  t.object,
  (o): o is t.Branded<ObjectID, Id> => o instanceof ObjectID,
  'Id'
);

export const Exercise = t.brand(t.string, (e): e is t.Branded<string, Ex> => e.length < 26, 'Ex');

export const Email = t.brand(
  t.string,
  (e): e is t.Branded<string, Email> => EMAIL_REGEX.test(e),
  'Email'
);

export const Password = t.brand(t.string, (p): p is t.Branded<string, PW> => p.length > 5, 'PW');
