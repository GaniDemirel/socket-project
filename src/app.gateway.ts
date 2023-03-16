import { Logger, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001'],
  },
})
export class AppGateway implements OnModuleInit {
  onModuleInit() {
    this.server.on('connection', (socket) => {
      socket.emit('onConnect', { event: 'msgToClient', data: socket.id });
    });
  }

  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string) {
    this.server.emit('onMessage', { event: 'mgsToClient', data: text });
    this.logger.log(`Message recived // user:  ${client.id} text: ${text}`);
  }
}
