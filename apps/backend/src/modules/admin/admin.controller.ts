import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Pobiera listę wszystkich użytkowników' })
  @ApiOkResponse({
    description: 'Zwraca tablicę użytkowników (encje User)',
    type: User,
    isArray: true,
  })
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Pobiera konkretnego użytkownika po ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID użytkownika' })
  @ApiOkResponse({
    description: 'Zwraca użytkownika (encja User)',
    type: User,
  })
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Aktualizuje dane użytkownika' })
  @ApiParam({ name: 'id', type: Number, description: 'ID użytkownika' })
  @ApiBody({
    description: 'Częściowe dane użytkownika do aktualizacji (Partial<User>)',
    schema: {
      example: {
        username: 'NowyUsername',
        email: 'new@example.com',
      },
    },
  })
  @ApiOkResponse({
    description: 'Zwraca zaktualizowanego użytkownika (encja User)',
    type: User,
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<User>,
  ) {
    return this.adminService.updateUser(id, updateData);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Usuwa użytkownika o podanym ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID użytkownika' })
  @ApiOkResponse({
    description: 'Zwraca komunikat o pomyślnym usunięciu',
    schema: {
      example: {
        message: 'User with id 5 deleted successfully',
      },
    },
  })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('users/:id/wallet')
  @ApiOperation({ summary: 'Pobiera historię transakcji portfela użytkownika' })
  @ApiParam({ name: 'id', type: Number, description: 'ID użytkownika' })
  @ApiOkResponse({
    description: 'Zwraca tablicę transakcji (WalletTransaction)',
    schema: {
      example: [
        {
          id: 10,
          userId: 5,
          type: 'deposit',
          amount: 500,
          createdAt: '2025-02-22T00:00:00.000Z',
        },
      ],
    },
  })
  getUserWalletTransactions(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getWalletTransactions(id);
  }

  @Get('users/:id/games')
  @ApiOperation({ summary: 'Pobiera sesje gier danego użytkownika' })
  @ApiParam({ name: 'id', type: Number, description: 'ID użytkownika' })
  @ApiOkResponse({
    description: 'Zwraca tablicę sesji gier (GameSession)',
    schema: {
      example: [
        {
          id: 3,
          userId: 5,
          gameType: 'blackjack',
          result: 'win',
          details: { bet: 50, payout: 100 },
          createdAt: '2025-02-22T00:05:00.000Z',
        },
      ],
    },
  })
  getUserGameSessions(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getGameSessions(id);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Pobiera ogólne statystyki (liczba użytkowników, depozytów, gier)',
  })
  @ApiOkResponse({
    description: 'Zwraca obiekt zawierający statystyki projektu (OverallStats)',
    schema: {
      example: {
        totalUsers: 10,
        totalDeposits: 4200,
        totalGames: 35,
      },
    },
  })
  getOverallStats() {
    return this.adminService.getOverallStats();
  }
}
