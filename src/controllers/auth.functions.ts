import { User as UserInterface } from '../types/models';
import { getPassword } from '../utils/daos';
import { ResetUserDetailsBody } from '../types';

/*== validateBody =====================================================

Validates the body of an incoming auth request (i.e. change email or
change password). Must accept an old credential, a new credential,
and a confirmed credential. New credential and confirmed credential
must match

*/

export const validateBody = (body: ResetUserDetailsBody): boolean => {
  if (!body.old || !body.new || !body.confirm) return false;

  if (body.new !== body.confirm) return false;

  return true;
};

/*== validateEmailWithPersistedEmail =====================================================

Validate's a change password request. Compares a provided password and the
stored password. If they don't match, then the request is not validated

*/

export const validateEmailWithPersistedEmail = (
  emails: [string, string]
): boolean => {
  if (emails[0] !== emails[1]) return false;
  return true;
};

/*== passwordMutation =====================================================

Mutate a user's password. Must match the hashed password first. If no match, 
validation fails.

*/

export const mutatePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string,
  password = getPassword
): Promise<boolean> => {
  // select the password from the user
  const user = (await password(id)) as UserInterface;

  // match the provided password and the user's password
  const isMatch = await user.matchPassword(oldPassword);

  // if there's no match, return an error
  if (!isMatch) return false;

  // save the password to the user
  user.password = newPassword;

  await user.save();

  return true;
};
