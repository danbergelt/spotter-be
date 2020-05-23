import { resolver } from '../utils/express';
import { pipe } from 'fp-ts/lib/pipeable';
import { Req, RawTag } from '../types';
import { authenticate } from '../services/authenticate';
import { chain, fromEither, fold, map, left, right } from 'fp-ts/lib/TaskEither';
import { tagDecoder, Tag } from '../validators/decoders';
import { validate } from '../services/validate';
import { of } from 'fp-ts/lib/Task';
import { sendError } from '../utils/http';
import { success, parseWrite } from '../utils/parsers';
import { CREATED, OK } from 'http-status-codes';
import { hooks } from '../services/hooks';
import { COLLECTIONS } from '../utils/constants';
import { duplicate } from '../utils/errors';

const { TAGS } = COLLECTIONS;

const { readOne, createOne, readMany } = hooks<Tag>(TAGS);
const decoder = validate(tagDecoder);

// create a new tag
export const postTag = resolver(async (req: Req<RawTag>, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(tag => fromEither(decoder(tag))),
    chain(tag =>
      pipe(
        readOne(db, tag),
        chain(dup => (dup ? left(duplicate('Tag')) : right(tag)))
      )
    ),
    chain(tag => pipe(createOne(db, tag), map(parseWrite))),
    fold(sendError(res), tag => of(res.status(CREATED).json(success({ tag }))))
  )();
});

// get all tags by user id
export const readTags = resolver(async (req: Req, res) => {
  const { db } = req.app.locals;

  return await pipe(
    authenticate(db, req),
    chain(user => readMany(db, user)),
    fold(sendError(res), tags => of(res.status(OK).json(success({ tags }))))
  )();
});
