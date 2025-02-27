import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
    ]),
    forwardRef(() => AuthModule )
  ]
})
export class ChatModule {}
