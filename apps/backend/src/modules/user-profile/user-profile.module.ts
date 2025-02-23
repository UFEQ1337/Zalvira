import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { WalletTransaction } from '../wallet/entities/wallet-transaction.entity';
import { GameSession } from '../casino/entities/game-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WalletTransaction, GameSession])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
