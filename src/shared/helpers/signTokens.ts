import { FilterQuery, QueryOptions, Model, Schema, Document } from 'mongoose';
import { signJwt } from '../../shared/utils/jwt';
import userModel, { IUser} from '../../model/user'
import { getEnvVariable, getEnvVariableAsInt } from '../../shared/utils/env';



// Sign Token
export const signTokens = async (user: IUser) => {
  
  // Sign the access token
  const access_token = signJwt(
    { sub: user._id },
    'ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: `${getEnvVariable('ACCESS_TOKEN_EXPIRES_IN')}m`,
    });

    const refresh_token = signJwt({ sub:user._id }, 'ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: `${getEnvVariable('REFRESH_TOKEN_EXPIRES_IN')}m`,
    });

  // Return access token and refresh token
  return { access_token, refresh_token };
}