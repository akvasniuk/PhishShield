import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Regexp } from '../../constants';

export class AuthGoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  @Matches(Regexp.JSONWEBTOKEN)
  credential: string;

  @IsString()
  @IsNotEmpty()
  @Matches(Regexp.GOOGLE_CLIENT_ID)
  clientId: string;
}