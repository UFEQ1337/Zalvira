import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { WalletTransaction } from '../../wallet/entities/wallet-transaction.entity';
import { GameSession } from '../../casino/entities/game-session.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @ApiProperty({
    example: 1,
    description: 'Unikalny identyfikator użytkownika',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Adres e-mail użytkownika',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'hashedPassword123',
    description: 'Hasło użytkownika (zaszyfrowane)',
  })
  @Column()
  password: string;

  @ApiProperty({
    example: 'JohnDoe',
    description: 'Nazwa użytkownika',
    required: false,
  })
  @Column({ nullable: true })
  username: string;

  @ApiProperty({ example: 100.5, description: 'Stan konta użytkownika' })
  @Column({ type: 'float', default: 0 })
  balance: number;

  @ApiProperty({
    description: 'Role przypisane użytkownikowi',
    enum: UserRole,
    isArray: true,
    example: [UserRole.USER],
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.USER],
  })
  roles: UserRole[];

  @ApiProperty({
    description: 'Data utworzenia rekordu',
    example: new Date().toISOString(),
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Data ostatniej aktualizacji rekordu',
    example: new Date().toISOString(),
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Transakcje portfela użytkownika',
    type: [WalletTransaction],
  })
  @OneToMany(
    () => WalletTransaction,
    (walletTransaction) => walletTransaction.user,
  )
  walletTransactions: WalletTransaction[];

  @ApiProperty({
    description: 'Sesje gier użytkownika',
    type: [GameSession],
  })
  @OneToMany(() => GameSession, (gameSession) => gameSession.user)
  gameSessions: GameSession[];
}
