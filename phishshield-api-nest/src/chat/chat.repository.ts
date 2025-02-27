import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './chat.schema';

@Injectable()
export class ChatRepository {
  constructor(@InjectModel(Chat.name)
              private readonly chatModel: Model<Chat>) {
  }

  async getMessages(from: string, to: string): Promise<Chat[]> {
    return this.chatModel
      .find({ users: { $all: [from, to] } })
      .sort({ updatedAt: 1 });
  }

  async createMessage(from: string, to: string, message: string): Promise<Chat> {
    return this.chatModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
  }

}