import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Adres e-mail użytkownika',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Niepoprawny format adresu e-mail' })
  readonly email: string;

  @ApiProperty({
    description: 'Hasło użytkownika (min. 6 znaków)',
    example: 'StrongPassword123!',
    minLength: 6,
    required: true,
  })
  @IsString()
  @MinLength(6, { message: 'Hasło musi mieć co najmniej 6 znaków' })
  readonly password: string;

  @ApiProperty({
    description: 'Opcjonalna nazwa użytkownika',
    example: 'newUser123',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly username?: string;
}
