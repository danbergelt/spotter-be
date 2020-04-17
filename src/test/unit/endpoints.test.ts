import { ep } from '../../utils/endpoints';
import express from 'express';
import { expect } from 'chai';

// TODO --> brittle testing, need to figure out how to improve this

describe('endpoints', () => {
  it('builds an endpoint', () => {
    const a = ep(express.Router());
    expect(a).to.be.a('function');
    const b = a('foo');
    expect(b).to.be.a('function');
    const c = b('get');
    expect(c).to.be.a('function');
    const d = c(() => {});
    expect(d).to.be.a('object');
  });
});
