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
export class GameSession {
  @ApiProperty({ example: 1, description: 'Unikalny identyfikator sesji gry' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'Identyfikator użytkownika' })
  @Column()
  userId: number;

  @ApiProperty({ example: 'win', description: 'Wynik gry' })
  @Column()
  result: string;

  @ApiProperty({ example: 'slot-machine', description: 'Typ gry' })
  @Column()
  gameType: string;

  @ApiProperty({ description: 'Szczegóły gry (JSON)' })
  @Column({ type: 'json', nullable: true })
  details: any;

  @ApiProperty({ description: 'Data utworzenia sesji gry' })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.gameSessions, { onDelete: 'CASCADE' })
  user: User;
}
