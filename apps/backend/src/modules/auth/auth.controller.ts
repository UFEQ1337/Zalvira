import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Rejestracja nowego użytkownika' })
  @ApiBody({
    description: 'Dane nowego użytkownika',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Przykładowy nowy użytkownik',
        value: {
          email: 'newuser@example.com',
          password: 'StrongPassword123!',
          username: 'newUser123',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Użytkownik został pomyślnie zarejestrowany',
    schema: {
      example: {
        message: 'User registered successfully',
        userId: 10,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Błąd walidacji lub konflikt (np. email już zajęty)',
    schema: {
      example: {
        statusCode: 400,
        message: 'User with this email already exists',
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logowanie użytkownika' })
  @ApiBody({
    description: 'Dane logowania użytkownika',
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Przykładowe dane logowania',
        value: {
          email: 'newuser@example.com',
          password: 'StrongPassword123!',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Zwraca token JWT po poprawnym zalogowaniu',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Błędne dane logowania',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid email or password',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
