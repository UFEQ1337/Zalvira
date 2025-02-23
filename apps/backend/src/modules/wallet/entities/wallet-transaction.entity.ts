import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class WalletTransaction {
  @ApiProperty({ example: 1, description: 'Unikalny identyfikator transakcji' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'Identyfikator użytkownika' })
  @Column()
  userId: number;

  @ApiProperty({ example: 'deposit', description: 'Typ transakcji' })
  @Column()
  type: string;

  @ApiProperty({ example: 100, description: 'Kwota transakcji' })
  @Column({ type: 'float' })
  amount: number;

  @ApiProperty({ description: 'Data utworzenia transakcji' })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.walletTransactions, {
    onDelete: 'CASCADE',
  })
  user: User;
}
