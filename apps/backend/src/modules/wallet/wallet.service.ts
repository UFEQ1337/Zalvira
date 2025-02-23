import { Injectable, BadRequestException } from '@nestjs/common';
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

  async deposit(userId: number, depositDto: DepositDto) {
    const { amount } = depositDto;
    const user =
      (await this.userRepository.findOne({ where: { id: userId } })) ||
      undefined;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.balance += amount;
    await this.userRepository.save(user);

    const transaction = this.walletTransactionRepository.create({
      userId: user.id,
      type: 'deposit',
      amount,
    });
    await this.walletTransactionRepository.save(transaction);

    return { message: 'Deposit successful', newBalance: user.balance };
  }

  async withdraw(userId: number, withdrawDto: WithdrawDto) {
    const { amount } = withdrawDto;
    const user =
      (await this.userRepository.findOne({ where: { id: userId } })) ||
      undefined;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }
    user.balance -= amount;
    await this.userRepository.save(user);

    const transaction = this.walletTransactionRepository.create({
      userId: user.id,
      type: 'withdrawal',
      amount,
    });
    await this.walletTransactionRepository.save(transaction);

    return { message: 'Withdrawal successful', newBalance: user.balance };
  }

  async transfer(userId: number, transferDto: TransferDto) {
    const { amount, recipientEmail, recipientUsername } = transferDto;

    const sender =
      (await this.userRepository.findOne({ where: { id: userId } })) ||
      undefined;
    if (!sender) {
      throw new BadRequestException('Sender not found');
    }
    if (sender.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    if (!recipientEmail && !recipientUsername) {
      throw new BadRequestException(
        'Please provide recipient email or username',
      );
    }
    let recipient: User | undefined;
    if (recipientEmail) {
      recipient =
        (await this.userRepository.findOne({
          where: { email: recipientEmail },
        })) || undefined;
    }
    if (!recipient && recipientUsername) {
      recipient =
        (await this.userRepository.findOne({
          where: { username: recipientUsername },
        })) || undefined;
    }
    if (!recipient) {
      throw new BadRequestException('Recipient not found');
    }

    sender.balance -= amount;
    recipient.balance += amount;
    await this.userRepository.save(sender);
    await this.userRepository.save(recipient);

    const senderTransaction = this.walletTransactionRepository.create({
      userId: sender.id,
      type: 'transfer-withdrawal',
      amount,
    });
    await this.walletTransactionRepository.save(senderTransaction);

    const recipientTransaction = this.walletTransactionRepository.create({
      userId: recipient.id,
      type: 'transfer-deposit',
      amount,
    });
    await this.walletTransactionRepository.save(recipientTransaction);

    return {
      message: 'Transfer successful',
      senderNewBalance: sender.balance,
      recipientId: recipient.id,
    };
  }
}
