import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({ example: 50, description: 'Kwota wypłaty' })
  amount!: number;
}
