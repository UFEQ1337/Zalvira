import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsIn, Min, Max } from 'class-validator';

export class PlayRouletteDto {
  @ApiProperty({ description: 'Kwota zakładu', example: 10 })
  @IsNumber()
  @Min(1)
  bet: number;

  @ApiProperty({
    description: 'Wybór numeru w ruletce (0-36)',
    example: 17,
    minimum: 0,
    maximum: 36,
  })
  @Min(0)
  @Max(36)
  @IsNumber()
  chosenNumber: number;
}
