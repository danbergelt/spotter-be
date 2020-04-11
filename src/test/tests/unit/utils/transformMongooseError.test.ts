import { transformMongooseError } from '../../../../utils/transformMongooseError';
import { Error } from 'mongoose';
import { expect } from 'chai';
import codes from 'http-status-codes';

describe('transform mongoose error', () => {
  it('returns the default error', () => {
    const error = transformMongooseError({} as any);
    expect(error.message).to.equal('Bad gateway');
    expect(error.status).to.equal(codes.BAD_GATEWAY);
  });

  it('returns the transformed cast error', () => {
    const error = transformMongooseError(
      new Error.CastError('foo', 'bar', 'baz')
    );
    expect(error.message).to.equal('Resource not found (Cast error)');
    expect(error.status).to.equal(codes.BAD_REQUEST);
  });

  it('returns the transformed validation error', () => {
    const error = transformMongooseError(new Error.ValidationError());
    expect(error.message).to.equal('Validation error');
    expect(error.status).to.equal(codes.BAD_REQUEST);
  });

  it('returns the transformed document not found error', () => {
    const error = transformMongooseError(
      new Error.DocumentNotFoundError('foo')
    );
    expect(error.message).to.equal(
      'Resource not found (Document not found error)'
    );
    expect(error.status).to.equal(codes.NOT_FOUND);
  });

  it('returns the transformed missing schema error', () => {
    const error = transformMongooseError(
      new Error.MissingSchemaError('foobar')
    );
    expect(error.message).to.equal('Type of resource does not exist');
    expect(error.status).to.equal(codes.NOT_FOUND);
  });

  it('returns the transformed parallel save error', () => {
    const error = transformMongooseError(
      new Error.ParallelSaveError('foo' as any)
    );
    expect(error.message).to.equal('Error handling concurrent requests');
    expect(error.status).to.equal(codes.CONFLICT);
  });
});
