import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class GameChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  io: Server;

  private readonly logger = new Logger(GameChatGateway.name);

  afterInit(server: Server) {
    this.logger.log('GameChatGateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    client.rooms.forEach((room) => {
      client.leave(room);
      const adapterRooms = this.io.adapter as unknown as {
        rooms: Map<string, Set<string>>;
      };
      const roomClients = adapterRooms.rooms.get(room);
      const count = roomClients ? roomClients.size : 0;
      this.io.to(room).emit('userCount', count);
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    if (room?.trim()) {
      client.join(room);
      this.logger.log(`Client ${client.id} joined room ${room}`);
      client.emit('joinedRoom', { room });
      const adapterRooms = this.io.adapter as unknown as {
        rooms: Map<string, Set<string>>;
      };
      const roomClients = adapterRooms.rooms.get(room);
      const count = roomClients ? roomClients.size : 0;
      this.io.to(room).emit('userCount', count);
    } else {
      this.logger.error(`Invalid room: ${room}`);
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    client: Socket,
    payload: { room: string; user: string; message: string },
  ) {
    if (!payload.message?.trim()) {
      this.logger.warn(
        `Empty message from ${payload.user} in room ${payload.room}`,
      );
      return;
    }

    this.logger.log(
      `Message from ${payload.user} in room ${payload.room}: ${payload.message}`,
    );
    this.io.to(payload.room).emit('message', payload);
  }
}
