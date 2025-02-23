import { Module } from '@nestjs/common';
import { CasinoService } from './casino.service';
import { CasinoController } from './casino.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSession } from './entities/game-session.entity';
import { User } from '../auth/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([GameSession, User])],
  controllers: [CasinoController],
  providers: [CasinoService],
})
export class CasinoModule {}
