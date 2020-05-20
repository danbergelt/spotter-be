// import { validate } from '../../../services/validate';
// import { schema } from '../../../validators';
// import { SCHEMAS } from '../../../utils/constants';
// import { left, right } from 'fp-ts/lib/TaskEither';
// import assert from 'assert';

// describe('validating middleware', () => {
//   it('throws error on failed validation', async () => {
//     const result = await validate(schema(SCHEMAS.USERS), { foo: 'bar' })();
//     const expected = await left({ message: 'Password is required', status: 400 })();
//     assert.deepStrictEqual(result, expected);
//   });

//   it('returns the data on a successful validation', async () => {
//     const result = await validate(schema(SCHEMAS.USERS), {
//       email: 'foo@bar.com',
//       password: 'foobar'
//     })();
//     const expected = await right({ email: 'foo@bar.com', password: 'foobar' })();
//     assert.deepStrictEqual(result, expected);
//   });
// });
