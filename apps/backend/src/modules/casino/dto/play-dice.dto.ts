import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class PlayDiceDto {
  @ApiProperty({ description: 'Kwota zakładu', example: 20 })
  @IsNumber()
  @Min(1)
  bet: number;

  @ApiProperty({
    description: 'Wybór sumy oczek (2-12)',
    example: 7,
    minimum: 2,
    maximum: 12,
  })
  @Min(2)
  @Max(12)
  @IsNumber()
  chosenSum: number;
}
