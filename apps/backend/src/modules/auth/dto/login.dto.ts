import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@example.com', description: 'Adres e-mail' })
  @IsEmail({}, { message: 'Niepoprawny format adresu e-mail' })
  email: string;

  @ApiProperty({ example: 'P@ssw0rd', description: 'Hasło użytkownika' })
  @IsNotEmpty({ message: 'Hasło nie może być puste' })
  password: string;
}
