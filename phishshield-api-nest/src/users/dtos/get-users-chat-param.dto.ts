import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { Type } from 'class-transformer';

export class GetUsersChatParamDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Type(() => String)
  userId: string;
}
