import { Body, Controller, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetMessagesDto } from './dto/get-messages.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('getMessages/:userId')
  @HttpCode(201)
  @UseGuards(AccessTokenGuard)
  async getMessages(@Body() getMessagesDto: GetMessagesDto) {
    return this.chatService.getMessages(getMessagesDto.from, getMessagesDto.to);
  }

  @UseGuards(AccessTokenGuard)
  @Post('postMessage/:userId')
  async addMessage(@Param('userId') userId: string, @Body() createMessageDto: CreateMessageDto) {
    const { from, to, message } = createMessageDto;
    return this.chatService.createMessage(from, to, message);
  }
}
