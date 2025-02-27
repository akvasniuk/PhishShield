import { Module, forwardRef } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './services/token.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthRepository } from './auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { OAuth, OAuthSchema } from './auth.schema';
import { MailModule } from '../mail/mail.module';
import { SocketModule } from '../gateway/socket.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, AuthGuard, AuthRepository],
  imports: [MongooseModule.forFeature([
    {
      name: OAuth.name,
      schema: OAuthSchema,
    },
  ]),
    forwardRef(() => UsersModule),
    MailModule,
    SocketModule
  ],
  exports: [AuthService, AuthGuard, TokenService, AuthRepository],
})
export class AuthModule {}
