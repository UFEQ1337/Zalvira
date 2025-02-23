import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsIn, Min } from 'class-validator';

export class AdvancedBlackjackDto {
  @ApiProperty({ description: 'Kwota zakładu', example: 50 })
  @IsNumber()
  @Min(1)
  bet: number;

  @ApiProperty({
    description: 'Działanie gracza',
    example: 'hit',
    enum: ['hit', 'stand'],
  })
  @IsIn(['hit', 'stand'])
  action: 'hit' | 'stand';
}
