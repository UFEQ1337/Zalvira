import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CasinoService } from './casino.service';
import { StartGameDto } from './dto/start-game.dto';
import { PlaySlotMachineDto } from './dto/play-slot-machine.dto';
import { PlayBlackjackDto } from './dto/play-blackjack.dto';
import { PlayRouletteDto } from './dto/play-roulette.dto';
import { PlayDiceDto } from './dto/play-dice.dto';
import { PlayBaccaratDto } from './dto/play-baccarat.dto';
import { PlayScratchCardDto } from './dto/play-scratch-card.dto';
import { AdvancedBlackjackDto } from './dto/play-advanced-blackjack.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GAMES_CONFIG } from './config/games.config';

interface RequestUser {
  id: number;
  email: string;
  roles?: string[];
}

@ApiTags('casino')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('casino')
export class CasinoController {
  constructor(private readonly casinoService: CasinoService) {}

  @Post('start')
  @ApiOperation({ summary: 'Rozpoczęcie gry z obstawieniem' })
  @ApiResponse({ status: 201, description: 'Gra rozpoczęta pomyślnie' })
  startGame(
    @CurrentUser() user: RequestUser,
    @Body() startGameDto: StartGameDto,
  ) {
    return this.casinoService.startGame(user.id, startGameDto.bet);
  }

  @Post('slot-machine')
  @ApiOperation({ summary: 'Gra na automatach (slot machine)' })
  playSlotMachine(
    @CurrentUser() user: RequestUser,
    @Body() dto: PlaySlotMachineDto,
  ) {
    return this.casinoService.playSlotMachine(user.id, dto.bet);
  }

  @Post('blackjack')
  @ApiOperation({ summary: 'Gra w blackjacka' })
  playBlackjack(
    @CurrentUser() user: RequestUser,
    @Body() dto: PlayBlackjackDto,
  ) {
    return this.casinoService.playBlackjack(user.id, dto.bet);
  }

  @Post('roulette')
  @ApiOperation({ summary: 'Gra w ruletkę' })
  playRoulette(@CurrentUser() user: RequestUser, @Body() dto: PlayRouletteDto) {
    return this.casinoService.playRoulette(user.id, dto.bet, dto.chosenNumber);
  }

  @Post('dice')
  @ApiOperation({ summary: 'Gra w kości' })
  playDice(@CurrentUser() user: RequestUser, @Body() dto: PlayDiceDto) {
    return this.casinoService.playDice(user.id, dto.bet, dto.chosenSum);
  }

  @Post('baccarat')
  @ApiOperation({ summary: 'Gra w baccarat' })
  playBaccarat(@CurrentUser() user: RequestUser, @Body() dto: PlayBaccaratDto) {
    return this.casinoService.playBaccarat(user.id, dto.bet, dto.betOn);
  }

  @Post('scratch-card')
  @ApiOperation({ summary: 'Zdrapka' })
  playScratchCard(
    @CurrentUser() user: RequestUser,
    @Body() dto: PlayScratchCardDto,
  ) {
    return this.casinoService.playScratchCard(user.id, dto.bet);
  }

  @Get('status')
  @ApiOperation({ summary: 'Sprawdzenie statusu kasyna' })
  getStatus() {
    return {
      status: 'Casino backend is up and running',
      games: GAMES_CONFIG,
    };
  }

  @Post('advanced-blackjack')
  @ApiOperation({ summary: 'Zaawansowana gra w blackjacka' })
  playAdvancedBlackjack(
    @CurrentUser() user: RequestUser,
    @Body() dto: AdvancedBlackjackDto,
  ) {
    return this.casinoService.playAdvancedBlackjack(
      user.id,
      dto.bet,
      dto.action,
    );
  }
}
