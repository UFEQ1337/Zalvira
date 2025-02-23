import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({ example: 100, description: 'Kwota wpłaty' })
  amount!: number;
}
