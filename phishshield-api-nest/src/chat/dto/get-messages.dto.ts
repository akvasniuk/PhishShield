import { IsMongoId } from 'class-validator';

export class GetMessagesDto {
  @IsMongoId()
  from: string;

  @IsMongoId()
  to: string;
}