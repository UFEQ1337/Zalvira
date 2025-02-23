import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsIn, Min } from 'class-validator';

export class PlayBlackjackDto {
  @ApiProperty({ description: 'Kwota zakładu', example: 100 })
  @IsNumber()
  @Min(1)
  bet: number;
}
