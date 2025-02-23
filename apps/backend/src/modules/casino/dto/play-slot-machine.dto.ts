import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsIn, Min } from 'class-validator';

export class PlaySlotMachineDto {
  @ApiProperty({ description: 'Kwota zakładu', example: 50 })
  @IsNumber()
  @Min(1)
  bet: number;
}
