import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PlayScratchCardDto {
  @ApiProperty({ description: 'Kwota zakładu', example: 15 })
  @IsNumber()
  @Min(1)
  bet: number;
}
