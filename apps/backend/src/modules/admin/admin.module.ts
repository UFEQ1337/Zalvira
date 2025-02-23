import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { WalletTransaction } from '../wallet/entities/wallet-transaction.entity';
import { GameSession } from '../casino/entities/game-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WalletTransaction, GameSession])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
