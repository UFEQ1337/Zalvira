import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class TransferDto {
  @ApiProperty({ description: 'Kwota przelewu', example: 50 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional({
    description: 'Email odbiorcy (przynajmniej jeden z pól musi być podany)',
    example: 'recipient@example.com',
  })
  @IsOptional()
  @IsString()
  recipientEmail?: string;

  @ApiPropertyOptional({
    description:
      'Nazwa użytkownika odbiorcy (przynajmniej jeden z pól musi być podany)',
    example: 'recipientUser',
  })
  @IsOptional()
  @IsString()
  recipientUsername?: string;
}
