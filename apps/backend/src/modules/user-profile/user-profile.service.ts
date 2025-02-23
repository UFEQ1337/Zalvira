import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { WalletTransaction } from '../wallet/entities/wallet-transaction.entity';
import { GameSession } from '../casino/entities/game-session.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

export interface UserProfile extends User {
  walletTransactions: WalletTransaction[];
  gameSessions: GameSession[];
}

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WalletTransaction)
    private readonly walletRepository: Repository<WalletTransaction>,
    @InjectRepository(GameSession)
    private readonly gameSessionRepository: Repository<GameSession>,
  ) {}

  async getProfile(userId: number): Promise<UserProfile> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const walletTransactions = await this.walletRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const { data: gameSessions, total } = await this.getGameSessions(userId);

    return {
      ...user,
      walletTransactions,
      gameSessions,
    };
  }

  async updateProfile(
    userId: number,
    updateData: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateData);
    await this.userRepository.save(user);
    return this.getProfile(userId);
  }

  async getWalletTransactions(userId: number): Promise<WalletTransaction[]> {
    return this.walletRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getGameSessions(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: GameSession[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.gameSessionRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return { data, total };
  }
}
