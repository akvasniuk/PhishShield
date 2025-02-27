import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Regexp } from '../../constants';

export class LoginDto {
  @IsString()
  @Matches(Regexp.EMAIL)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(256)
  password: string;
}