const app = require('../../../utils/index');
import { describe, it } from 'mocha';
import User from '../../../../models/user';
import chaiHttp from 'chai-http';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import decode from 'jwt-decode';
import Exercise from '../../../../models/Exercise';
import Tag from '../../../../models/Tag';
chai.use(chaiAsPromised);
//@ts-ignore
const should = chai.should();

// configure Chai HTTP
chai.use(chaiHttp);

describe('delete account', () => {
  beforeEach(async () => await User.deleteMany({}));

  it('should successfully delete account and cascade delete all documents', async () => {
    const res = await chai
      .request(app)
      .post('/api/auth/register')
      .send({ email: 'test@email.com', password: 'password' });

    const { id } = decode(res.body.token);

    await new Exercise({ name: 'foo', user: id }).save();
    await new Tag({ color: 'red', user: id }).save();

    const res2 = await chai
      .request(app)
      .delete('/api/auth/user/delete')
      .set('Authorization', `Bearer ${res.body.token}`);

    res2.body.success.should.be.ok;
    const users = await User.find({});
    users.length.should.equal(0);
    const tags = await Tag.find({});
    tags.length.should.equal(0);
    const exercises = await Exercise.find({});
    exercises.length.should.equal(0);
  });
});
