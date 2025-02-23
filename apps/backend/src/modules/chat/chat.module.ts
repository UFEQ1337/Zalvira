import { Module } from '@nestjs/common';
import { GameChatGateway } from './chat.gateway';

@Module({
  providers: [GameChatGateway],
  exports: [GameChatGateway],
})
export class ChatModule {}
