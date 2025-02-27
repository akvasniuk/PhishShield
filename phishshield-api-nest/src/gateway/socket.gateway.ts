import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_CONNECTION_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;
  private onlineUsers = new Map<string, string>();

  handleConnection(socket: Socket) {
    console.log(`User connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`User disconnected: ${socket.id}`);
    this.onlineUsers.forEach((value, key) => {
      if (value === socket.id) this.onlineUsers.delete(key);
    });
  }

  @SubscribeMessage('add-user')
  handleAddUser(socket: Socket, userId: string) {
    this.onlineUsers.set(userId, socket.id);
    console.log(`User added: ${userId} -> ${socket.id}`);
  }

  @SubscribeMessage('send-msg')
  handleSendMessage(socket: Socket, data: { to: string; msg: string }) {
    const sendUserSocket = this.onlineUsers.get(data.to);
    if (sendUserSocket) {
      this.io.to(sendUserSocket).emit('msg-receive', data.msg);
    }
  }

  removeUser(userId: string) {
    this.onlineUsers.delete(userId);
  }
}
