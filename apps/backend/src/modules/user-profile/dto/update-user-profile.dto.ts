import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ description: 'Nowa nazwa użytkownika' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: 'Nowy adres e-mail' })
  @IsOptional()
  @IsEmail({}, { message: 'Niepoprawny format adresu e-mail' })
  email?: string;

  @ApiPropertyOptional({ description: 'Nowe hasło (min. 6 znaków)' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Hasło musi mieć co najmniej 6 znaków' })
  password?: string;
}
