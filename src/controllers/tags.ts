import { resolver } from '../utils/express';
import { pipe } from 'fp-ts/lib/pipeable';
import { Req, RawTag } from '../types';
import { authenticate } from '../services/authenticate';
import { chain, fromEither, fold, map, left, right } from 'fp-ts/lib/TaskEither';
import { tagDecoder, Tag } from '../validators/decoders';
import { validate } from '../services/validate';
import { of } from 'fp-ts/lib/Task';
import { sendError } from '../utils/http';
import { success, e, parseWrite } from '../utils/parsers';
import { CREATED, BAD_REQUEST } from 'http-status-codes';
import { hooks } from '../services/hooks';
import { COLLECTIONS } from '../utils/constants';

const { TAGS } = COLLECTIONS;

const { readMany, createOne } = hooks<Tag>(TAGS);
const decoder = validate(tagDecoder);

export const postTag = resolver(async (req: Req<RawTag>, res) => {
  const { db } = req.app.locals;
  const { color, content } = req.body;

  return await pipe(
    authenticate(db, req),
    chain(tag => fromEither(decoder(tag))),
    chain(tag =>
      pipe(
        readMany(db, { user: tag.user }),
        chain(tags => (tags.length > 25 ? left(e('25 tag maximum', BAD_REQUEST)) : right(tags))),
        map(tags => tags.find(tag => tag.color === color && tag.content === content)),
        chain(duplicate => (duplicate ? left(e('Tag already exists', BAD_REQUEST)) : right(tag)))
      )
    ),
    chain(tag => createOne(db, tag)),
    map(parseWrite),
    fold(sendError(res), tag => of(res.status(CREATED).json(success({ tag }))))
  )();
});
