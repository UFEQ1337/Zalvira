import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { User } from '../../modules/auth/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getBalance(userId: number): Promise<{ balance: number }> {
    const user = await this.findUserById(userId);
    return { balance: user.balance };
  }

  async deposit(userId: number, depositDto: DepositDto) {
    if (depositDto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const user = await this.findUserById(userId);
    user.balance += depositDto.amount;
    await this.userRepository.save(user);

    const transaction = this.walletTransactionRepository.create({
      userId: user.id,
      type: 'deposit',
      amount: depositDto.amount,
    });
    await this.walletTransactionRepository.save(transaction);

    return { message: 'Deposit successful', newBalance: user.balance };
  }

  async withdraw(userId: number, withdrawDto: WithdrawDto) {
    if (withdrawDto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const user = await this.findUserById(userId);
    if (user.balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    user.balance -= withdrawDto.amount;
    await this.userRepository.save(user);

    const transaction = this.walletTransactionRepository.create({
      userId: user.id,
      type: 'withdrawal',
      amount: withdrawDto.amount,
    });
    await this.walletTransactionRepository.save(transaction);

    return { message: 'Withdrawal successful', newBalance: user.balance };
  }

  async transfer(userId: number, transferDto: TransferDto) {
    if (transferDto.amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const sender = await this.findUserById(userId);
    if (sender.balance < transferDto.amount) {
      throw new BadRequestException('Insufficient funds');
    }

    const recipient = await this.userRepository.findOne({
      where: [
        { email: transferDto.recipientEmail },
        { username: transferDto.recipientUsername },
      ],
    });

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    sender.balance -= transferDto.amount;
    recipient.balance += transferDto.amount;
    await this.userRepository.save([sender, recipient]);

    await this.walletTransactionRepository.save([
      this.walletTransactionRepository.create({
        userId: sender.id,
        type: 'transfer-out',
        amount: transferDto.amount,
      }),
      this.walletTransactionRepository.create({
        userId: recipient.id,
        type: 'transfer-in',
        amount: transferDto.amount,
      }),
    ]);

    return {
      message: 'Transfer successful',
      senderNewBalance: sender.balance,
      recipientId: recipient.id,
    };
  }
}
