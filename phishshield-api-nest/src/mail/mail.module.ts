import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { TokenService } from '../auth/services/token.service';

@Module({
  controllers: [MailController],
  providers: [MailService, TokenService],
  exports: [MailService, TokenService]
})
export class MailModule {}
