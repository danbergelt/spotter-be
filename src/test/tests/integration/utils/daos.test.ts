import {
  findMany,
  aggregate,
  updateOne,
  updateMany,
  getPassword,
  deleteOne,
  findById,
  findOne,
  deleteMany
} from '../../../../utils/daos';
import { createUser } from '../../../utils/createUser';
import {
  User as UserType,
  Exercise as ExerciseType
} from '../../../../types/models';
import Exercise from '../../../../models/Exercise';
import { expect } from 'chai';
import User from '../../../../models/user';

describe('mongo query helper functions', () => {
  let user: UserType;
  let e1: ExerciseType;
  let e2: ExerciseType;

  beforeEach(async () => {
    user = await createUser();
    user = user.toJSON();
    delete user.password;
    e1 = new Exercise({ name: 'foo', user: user._id });
    e2 = new Exercise({ name: 'bar', user: user._id });
    e1 = await e1.save();
    e2 = await e2.save();
  });

  it('findById returns a document', async () => {
    const document = await findById(User, user._id);
    expect(document?.toJSON()).to.deep.equal(user);
  });

  it('findMany returns an array of documents', async () => {
    const documents = await findMany(Exercise, user._id);
    expect(documents.length).to.equal(2);
    expect(documents[0].toString()).to.equal(e1.toString());
    expect(documents[1].toString()).to.equal(e2.toString());
  });

  it('aggregate returns an array of documents', async () => {
    const documents: ExerciseType[] = await aggregate(Exercise, [
      { $match: { user: user._id } }
    ]);
    expect(documents.length).to.equal(2);
    expect(documents[0]).to.deep.equal(e1.toObject());
    expect(documents[1]).to.deep.equal(e2.toObject());
  });

  it('updateOne returns an updated document', async () => {
    const document: ExerciseType | null = await updateOne(
      Exercise,
      { user: user._id },
      { name: 'updated!' }
    );
    expect(document!.name).to.equal('updated!');
  });

  it('updateMany returns details', async () => {
    const details: any = await updateMany(
      Exercise,
      { user: user._id },
      { name: 'update many' }
    );

    expect(details).to.deep.equal({ n: 2, nModified: 2, ok: 1 });
  });

  it('getPassword returns a user with the password', async () => {
    const withPassword: any = await getPassword(user._id);

    expect(withPassword.password).to.be.a('string');
  });

  it('deleteOne deletes a document', async () => {
    await deleteOne(User, user._id);
    const document = await findById(User, user._id);
    expect(document).to.be.null;
  });

  it('findOne returns a document with an arbitrary filter', async () => {
    const document = await findOne(User, { email: user.email });
    expect(document?.toJSON()).to.deep.equal(user);
  });

  it('deleteMany deletes many documents', async () => {
    const results = await deleteMany(Exercise, { user: user._id });
    expect(results.n).to.equal(2);
    expect(results.ok).to.equal(1);
    expect(results.deletedCount).to.equal(2);
  });
});
