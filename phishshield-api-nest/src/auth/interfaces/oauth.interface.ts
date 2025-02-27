import { User } from '../../users/user.schema';

export interface OauthInterface {
  accessToken: string;
  refreshToken: string;
  passwordToken: string;
  emailToken: string;
  user: User;
}