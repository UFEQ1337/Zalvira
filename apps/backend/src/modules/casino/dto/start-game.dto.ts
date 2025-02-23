import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class StartGameDto {
  @ApiProperty({
    description: 'Kwota zakładu przy rozpoczęciu gry',
    example: 50,
  })
  @IsNumber()
  @Min(1)
  bet: number;
}
