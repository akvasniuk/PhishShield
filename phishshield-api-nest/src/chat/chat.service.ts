import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async getMessages(from: string, to: string) {
    const messages = await this.chatRepository.getMessages(from, to);

    return messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    }));
  }

  async createMessage(from: string, to: string, message: string) {
    return this.chatRepository.createMessage(from, to, message);
  }
}
