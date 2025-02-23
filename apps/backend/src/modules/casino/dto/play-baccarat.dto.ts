import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsIn, Min } from 'class-validator';

export class PlayBaccaratDto {
  @ApiProperty({ description: 'Kwota zakładu', example: 30 })
  @IsNumber()
  @Min(1)
  bet: number;

  @ApiProperty({
    description: 'Zakład na gracza lub bankiera',
    example: 'player',
    enum: ['player', 'banker'],
  })
  @IsIn(['player', 'banker'])
  betOn: 'player' | 'banker';
}
