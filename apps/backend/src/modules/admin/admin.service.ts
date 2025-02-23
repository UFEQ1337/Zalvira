import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { WalletTransaction } from '../wallet/entities/wallet-transaction.entity';
import { GameSession } from '../casino/entities/game-session.entity';

export interface OverallStats {
  totalUsers: number;
  totalDeposits: number;
  totalGames: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    @InjectRepository(GameSession)
    private gameSessionRepository: Repository<GameSession>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.getUserById(id);
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    await this.gameSessionRepository.delete({ userId });

    await this.walletTransactionRepository.delete({ userId });

    const deleteResult = await this.userRepository.delete(userId);

    if (!deleteResult.affected) {
      throw new NotFoundException('User not found');
    }

    return { message: `User with ID ${userId} deleted successfully` };
  }

  async getWalletTransactions(userId: number) {
    return this.walletTransactionRepository.find({ where: { userId } });
  }

  async getGameSessions(userId: number) {
    return this.gameSessionRepository.find({ where: { userId } });
  }

  async getOverallStats(): Promise<OverallStats> {
    const totalUsers = await this.userRepository.count();
    const totalDepositsResult = (await this.walletTransactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'sum')
      .where("transaction.type = 'deposit'")
      .getRawOne()) as { sum: number | null };
    const totalDeposits = totalDepositsResult.sum ? totalDepositsResult.sum : 0;
    const totalGames = await this.gameSessionRepository.count();
    return {
      totalUsers,
      totalDeposits,
      totalGames,
    };
  }
}
