import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsString()
  message: string;
}