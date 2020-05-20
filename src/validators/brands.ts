import * as t from 'io-ts';
import { DATE_REGEX, EMAIL_REGEX } from 'src/utils/constants';
import { ObjectId } from 'mongodb';

const StrDate = t.brand(
  t.string,
  (d): d is t.Branded<string, { readonly D: unique symbol }> => DATE_REGEX.test(d),
  'D'
);

// TODO --> need to fix this type, io-ts cannot match actual ObjectIDs with the branded version (causing lots of typecasting)
const OId = t.brand(
  t.object,
  (o): o is t.Branded<ObjectId, { readonly Id: unique symbol }> => o instanceof ObjectId,
  'Id'
);

const Exercise = t.brand(
  t.string,
  (e): e is t.Branded<string, { readonly Exercise: unique symbol }> => e.length < 26,
  'Exercise'
);

const Email = t.brand(
  t.string,
  (e): e is t.Branded<string, { readonly Email: unique symbol }> => EMAIL_REGEX.test(e),
  'Email'
);

export const Password = t.brand(
  t.string,
  (p): p is t.Branded<string, { readonly PW: unique symbol }> => p.length > 5,
  'PW'
);

export default { StrDate, OId, Exercise, Email, Password };
