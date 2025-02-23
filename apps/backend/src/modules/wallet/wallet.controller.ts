import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

interface RequestUser {
  id: number;
  email: string;
  roles?: string[];
}

@ApiTags('wallet')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('deposit')
  @HttpCode(201)
  @ApiOperation({ summary: 'Dokonaj wpłaty do portfela' })
  @ApiResponse({ status: 201, description: 'Wpłata zakończona sukcesem' })
  @ApiResponse({ status: 400, description: 'Nieprawidłowe dane' })
  deposit(@Body() depositDto: DepositDto, @CurrentUser() user: RequestUser) {
    return this.walletService.deposit(user.id, depositDto);
  }

  @Post('withdraw')
  @HttpCode(201)
  @ApiOperation({ summary: 'Dokonaj wypłaty z portfela' })
  @ApiResponse({ status: 201, description: 'Wypłata zakończona sukcesem' })
  @ApiResponse({ status: 400, description: 'Brak wystarczających środków' })
  withdraw(@Body() withdrawDto: WithdrawDto, @CurrentUser() user: RequestUser) {
    return this.walletService.withdraw(user.id, withdrawDto);
  }

  @Post('transfer')
  @HttpCode(201)
  @ApiOperation({ summary: 'Przelew środków do innego użytkownika' })
  @ApiResponse({ status: 201, description: 'Przelew zakończony sukcesem' })
  @ApiResponse({ status: 400, description: 'Błędne dane lub brak środków' })
  transfer(@Body() transferDto: TransferDto, @CurrentUser() user: RequestUser) {
    return this.walletService.transfer(user.id, transferDto);
  }
}
