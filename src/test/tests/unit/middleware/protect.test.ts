import { protect } from '../../../../middleware/protect';
import sinon from 'sinon';
import chai from 'chai';
import { genToken } from '../../../../test/utils/genToken';
import mongoose from 'mongoose';
import { createUser } from '../../../../test/utils/createUser';

const expect = chai.expect;

const utils = (headers: any, ret = 'Generic error') => {
  const req = { headers } as any;
  const res = {} as any;
  const next = sinon.stub().returns(ret);
  const errorFactory = sinon.stub().callsFake(next);
  return { req, res, next, errorFactory };
};

describe('protect middleware', () => {
  it('protect returns the protector middleware', () => {
    const { errorFactory } = utils({});
    const protector = protect(errorFactory);

    expect(protector).to.be.a('Function');
    expect(protector.length).to.equal(3);
  });

  it('calls errorFactory when no authorization header is found', async () => {
    const { req, res, next, errorFactory } = utils({}, 'No header');
    const protector = protect(errorFactory);
    await protector(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(errorFactory.calledOnce).to.be.true;
    expect(next.returned('No header'));
  });

  it('calls errorFactory when authorization header is malformed', async () => {
    const { req, res, next, errorFactory } = utils(
      { malformed: 'foo' },
      'Malformed header'
    );
    const protector = protect(errorFactory);
    await protector(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(errorFactory.calledOnce).to.be.true;
    expect(next.returned('Malformed header'));
  });

  it('calls errorFactory when authorization header does not start with bearer', async () => {
    const { req, res, next, errorFactory } = utils(
      { authorization: 'Foobar token' },
      'Malformed token'
    );
    const protector = protect(errorFactory);
    await protector(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(errorFactory.calledOnce).to.be.true;
    expect(next.returned('Malformed token'));
  });

  it('calls errorFactory when token is undefined', async () => {
    const { req, res, next, errorFactory } = utils(
      { authorization: 'Bearer' },
      'Undefined token'
    );
    const protector = protect(errorFactory);
    await protector(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(errorFactory.calledOnce).to.be.true;
    expect(next.returned('Undefined token'));
  });

  it('calls errorFactory when token exists, but is denied as invalid jwt', async () => {
    const { req, res, next, errorFactory } = utils(
      { authorization: 'Bearer token' },
      'Rejected token'
    );
    const protector = protect(errorFactory);
    await protector(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(errorFactory.calledOnce).to.be.true;
    expect(next.returned('Rejected token'));
  });

  it('calls errorFactory when token is valid, but decoded id is malformed', async () => {
    const token = genToken('foobar');

    const { req, res, next, errorFactory } = utils(
      { authorization: `Bearer ${token}` },
      'Malformed id'
    );
    const protector = protect(errorFactory);
    await protector(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(errorFactory.calledOnce).to.be.true;
    expect(next.returned('Malformed id'));
  });

  it('calls errorFactory when token is valid, but user does not exist with the decoded id', async () => {
    const id = new mongoose.Types.ObjectId();

    const token = genToken(id.toHexString());

    const { req, res, next, errorFactory } = utils(
      { authorization: `Bearer ${token}` },
      'User does not exist'
    );
    const protector = protect(errorFactory);
    await protector(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(errorFactory.calledOnce).to.be.true;
    expect(next.returned('User does not exist'));
  });

  it('calls next and continues to controller on successful authentication', async () => {
    const { id } = await createUser();

    const token = genToken(id);

    const { req, res, next, errorFactory } = utils(
      { authorization: `Bearer ${token}` },
      'Success'
    );
    const protector = protect(errorFactory);
    await protector(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(errorFactory.calledOnce).not.to.be.true;
    expect(next.returned('Success'));
  });
});
