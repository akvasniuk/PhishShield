import { forwardRef, Module } from '@nestjs/common';
import { User, UserSchema } from './user.schema';

import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './user.repository';
import { UserHelper } from './helpers/user.helper';
import { PasswordHelper } from './helpers/password.helper';
import { MailModule } from '../mail/mail.module';
import { FileModule } from '../file/file.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserHelper, PasswordHelper],
  exports: [UsersService, UsersRepository, UserHelper, PasswordHelper],
  imports: [
    MailModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    FileModule
  ],
})
export class UsersModule {}
