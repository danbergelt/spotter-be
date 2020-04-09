import {
  findMany,
  aggregate,
  updateOne,
  updateMany
} from '../../../../utils/daos';
import { expect } from 'chai';
import Sinon from 'sinon';

const documents = [{ foo: 'bar' }, { bar: 'baz' }];
const Model = {} as any;
Model.find = Sinon.stub().returns(documents);
Model.aggregate = Sinon.stub().returns(documents);
Model.findOneAndUpdate = Sinon.stub().returns(documents[0]);
Model.updateMany = Sinon.stub().returns({ n: 1 });

describe('mongo query helper functions', () => {
  it('findMany returns an array of documents', async () => {
    const returnedDocuments = await findMany(Model, 'id');
    expect(returnedDocuments).to.deep.equal(documents);
  });

  it('aggregate aggregates an array of documents according to the stages param', async () => {
    const aggregated = await aggregate(Model, [{ some: 'stage' }]);
    expect(aggregated).to.deep.equal(documents);
  });

  it('updateOne returns a document', async () => {
    const document = await updateOne(
      Model,
      { filter: 'foo' },
      { update: 'bar' }
    );
    expect(document).to.deep.equal(documents[0]);
  });

  it('updateMany returns update details', async () => {
    const update = await updateMany(
      Model,
      { filter: 'foo' },
      { update: 'bar' }
    );
    expect(update).to.deep.equal({ n: 1 });
  });
});
