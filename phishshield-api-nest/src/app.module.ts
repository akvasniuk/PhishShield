import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { ChatModule } from './chat/chat.module';
import { StatisticsModule } from './statistics/statistics.module';
import { PhishingDetectionModule } from './phishing-detection/phishing-detection.module';
import { CommentModule } from './comment/comment.module';
import appConfig from './config/app.config';
import environmentValidation from './config/environment.validation';
import * as process from 'node:process';
import { SocketModule } from './gateway/socket.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
      validationSchema: environmentValidation
    }),
    MongooseModule.forRoot(
      process.env.DB_CONNECTION_URL
    ),
    FileModule,
    MailModule,
    ChatModule,
    StatisticsModule,
    PhishingDetectionModule,
    CommentModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
