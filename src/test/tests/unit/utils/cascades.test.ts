import Sinon from 'sinon';
import { cascadeDeleteTag, cascadeUpdateTag } from '../../../../utils/cascades';
import { expect } from 'chai';

const Model = {} as any;
const id = 'foo' as any;
const update = 'bar' as any;
const dbCall = Sinon.stub();

describe('cascade unit tests', () => {
  beforeEach(() => {
    dbCall.resetHistory();
  });

  it('cascade delete tag calls the db', async () => {
    await cascadeDeleteTag({ Model, id }, dbCall);
    expect(dbCall.calledOnce).to.be.true;
  });

  it('cascade update tag calls the db', async () => {
    await cascadeUpdateTag({ Model, id, update }, dbCall);
    expect(dbCall.calledOnce).to.be.true;
  });
});
