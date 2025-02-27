import { IsString, IsOptional, IsEnum, ValidateIf, IsUrl } from 'class-validator';

export class PredictPhishingDto {
  @ValidateIf((dto) => dto.type === 'text')
  @IsString()
  text?: string;

  @ValidateIf((dto) => dto.type === 'url')
  @IsUrl()
  url?: string;
}