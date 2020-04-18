import { c } from '../../utils/c';
import express from 'express';
import { expect } from 'chai';

// TODO --> brittle testing, need to figure out how to improve this

describe('endpoints', () => {
  it('builds an endpoint', () => {
    const one = c(express.Router());
    expect(one).to.be.a('function');
    const two = one('foo');
    expect(two).to.be.a('function');
    const three = two('get');
    expect(three).to.be.a('function');
    const four = three(() => {});
    expect(four).to.be.a('object');
  });
});
