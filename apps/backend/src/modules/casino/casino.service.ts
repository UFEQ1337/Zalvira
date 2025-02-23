import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameSession } from './entities/game-session.entity';
import { User } from '../auth/entities/user.entity';
import { RandomGeneratorService } from '../../common/services/random-generator.service';

@Injectable()
export class CasinoService {
  constructor(
    @InjectRepository(GameSession)
    private readonly gameSessionRepository: Repository<GameSession>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly randomGeneratorService: RandomGeneratorService,
  ) {}

  private async validateBalance(userId: number, bet: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.balance < bet) {
      throw new BadRequestException('Insufficient funds');
    }
    return user;
  }

  async startGame(userId: number, bet: number) {
    const user = await this.validateBalance(userId, bet);
    user.balance -= bet;
    await this.userRepository.save(user);

    const gameResult =
      this.randomGeneratorService.getRandom() > 0.5 ? 'win' : 'lose';
    const session = this.gameSessionRepository.create({
      userId,
      result: gameResult,
      gameType: 'basic',
      details: { bet },
    });
    const savedSession = await this.gameSessionRepository.save(session);
    return { userId, result: gameResult, sessionId: savedSession.id, bet };
  }

  async playSlotMachine(userId: number, bet: number) {
    const user = await this.validateBalance(userId, bet);
    user.balance -= bet;
    const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '7'];
    const reel1 =
      symbols[this.randomGeneratorService.getRandomInt(0, symbols.length - 1)];
    const reel2 =
      symbols[this.randomGeneratorService.getRandomInt(0, symbols.length - 1)];
    const reel3 =
      symbols[this.randomGeneratorService.getRandomInt(0, symbols.length - 1)];
    const reels = [reel1, reel2, reel3];
    let outcome = 'lose';
    let payout = 0;
    if (reel1 === reel2 && reel2 === reel3) {
      outcome = 'win';
      payout = reel1 === '7' ? bet * 10 : bet * 5;
      user.balance += payout;
    }
    await this.userRepository.save(user);
    const details = { reels, bet, payout };
    const session = this.gameSessionRepository.create({
      userId,
      result: outcome,
      gameType: 'slot-machine',
      details,
    });
    const savedSession = await this.gameSessionRepository.save(session);
    return { outcome, reels, payout, sessionId: savedSession.id };
  }

  async playBlackjack(userId: number, bet: number) {
    const user = await this.validateBalance(userId, bet);
    user.balance -= bet;
    const getCard = () => this.randomGeneratorService.getRandomInt(1, 11);
    const playerCards = [getCard(), getCard()];
    const dealerCards = [getCard(), getCard()];
    const playerTotal = playerCards.reduce((a, b) => a + b, 0);
    const dealerTotal = dealerCards.reduce((a, b) => a + b, 0);
    let outcome: string;
    let payout = 0;
    if (playerTotal > 21) {
      outcome = 'lose';
    } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
      outcome = 'win';
      payout = bet * 2;
      user.balance += payout;
    } else if (playerTotal === dealerTotal) {
      outcome = 'draw';
      payout = bet;
      user.balance += payout;
    } else {
      outcome = 'lose';
    }
    await this.userRepository.save(user);
    const details = {
      playerCards,
      dealerCards,
      playerTotal,
      dealerTotal,
      bet,
      payout,
    };
    const session = this.gameSessionRepository.create({
      userId,
      result: outcome,
      gameType: 'blackjack',
      details,
    });
    const savedSession = await this.gameSessionRepository.save(session);
    return {
      outcome,
      playerCards,
      dealerCards,
      payout,
      sessionId: savedSession.id,
    };
  }

  async playRoulette(userId: number, bet: number, chosenNumber: number) {
    const user = await this.validateBalance(userId, bet);
    user.balance -= bet;
    const winningNumber = this.randomGeneratorService.getRandomInt(0, 36);
    let outcome: string;
    let payout = 0;
    if (winningNumber === chosenNumber) {
      outcome = 'win';
      payout = bet * 35;
      user.balance += payout;
    } else {
      outcome = 'lose';
    }
    await this.userRepository.save(user);
    const details = { chosenNumber, winningNumber, bet, payout };
    const session = this.gameSessionRepository.create({
      userId,
      result: outcome,
      gameType: 'roulette',
      details,
    });
    const savedSession = await this.gameSessionRepository.save(session);
    return { outcome, winningNumber, payout, sessionId: savedSession.id };
  }

  async playDice(userId: number, bet: number, chosenSum: number) {
    const user = await this.validateBalance(userId, bet);
    user.balance -= bet;
    const dice1 = this.randomGeneratorService.getRandomInt(1, 6);
    const dice2 = this.randomGeneratorService.getRandomInt(1, 6);
    const sum = dice1 + dice2;
    let outcome: string;
    let payout = 0;
    if (sum === chosenSum) {
      outcome = 'win';
      payout = bet * 5;
      user.balance += payout;
    } else {
      outcome = 'lose';
    }
    await this.userRepository.save(user);
    const details = { dice: [dice1, dice2], sum, chosenSum, bet, payout };
    const session = this.gameSessionRepository.create({
      userId,
      result: outcome,
      gameType: 'dice',
      details,
    });
    const savedSession = await this.gameSessionRepository.save(session);
    return {
      outcome,
      dice: [dice1, dice2],
      sum,
      payout,
      sessionId: savedSession.id,
    };
  }

  async playBaccarat(userId: number, bet: number, betOn: 'player' | 'banker') {
    const user = await this.validateBalance(userId, bet);
    user.balance -= bet;
    const winner =
      this.randomGeneratorService.getRandom() > 0.5 ? 'player' : 'banker';
    let outcome: string;
    let payout = 0;
    if (winner === betOn) {
      outcome = 'win';
      payout = bet * 2;
      user.balance += payout;
    } else {
      outcome = 'lose';
    }
    await this.userRepository.save(user);
    const details = { betOn, winner, bet, payout };
    const session = this.gameSessionRepository.create({
      userId,
      result: outcome,
      gameType: 'baccarat',
      details,
    });
    const savedSession = await this.gameSessionRepository.save(session);
    return { outcome, winner, payout, sessionId: savedSession.id };
  }

  async playScratchCard(userId: number, bet: number) {
    const user = await this.validateBalance(userId, bet);
    user.balance -= bet;
    const symbols = ['⭐', '💎', '🍀', '7'];
    const card1 =
      symbols[this.randomGeneratorService.getRandomInt(0, symbols.length - 1)];
    const card2 =
      symbols[this.randomGeneratorService.getRandomInt(0, symbols.length - 1)];
    const card3 =
      symbols[this.randomGeneratorService.getRandomInt(0, symbols.length - 1)];
    const cards = [card1, card2, card3];
    let outcome = 'lose';
    let payout = 0;
    if (card1 === card2 && card2 === card3) {
      outcome = 'win';
      payout = bet * 10;
      user.balance += payout;
    } else if (card1 === card2 || card2 === card3 || card1 === card3) {
      outcome = 'win';
      payout = bet * 3;
      user.balance += payout;
    }
    await this.userRepository.save(user);
    const details = { cards, bet, payout };
    const session = this.gameSessionRepository.create({
      userId,
      result: outcome,
      gameType: 'scratch-card',
      details,
    });
    const savedSession = await this.gameSessionRepository.save(session);
    return { outcome, cards, payout, sessionId: savedSession.id };
  }

  async playAdvancedBlackjack(
    userId: number,
    bet: number,
    action: 'hit' | 'stand',
  ) {
    const user = await this.validateBalance(userId, bet);
    user.balance -= bet;
    const playerCards = [this.getRandomCard(), this.getRandomCard()];
    let dealerCards: number[] = [];
    let result = 'incomplete';
    if (action === 'stand') {
      dealerCards = [this.getRandomCard(), this.getRandomCard()];
      const playerTotal = playerCards.reduce((a, b) => a + b, 0);
      const dealerTotal = dealerCards.reduce((a, b) => a + b, 0);
      result =
        playerTotal > dealerTotal
          ? 'win'
          : playerTotal === dealerTotal
            ? 'draw'
            : 'lose';
    } else if (action === 'hit') {
      playerCards.push(this.getRandomCard());
      const playerTotal = playerCards.reduce((a, b) => a + b, 0);
      result = playerTotal > 21 ? 'lose' : 'incomplete';
    }
    let payout = 0;
    if (result === 'win') {
      payout = bet * 2;
      user.balance += payout;
    } else if (result === 'draw') {
      payout = bet;
      user.balance += payout;
    }
    await this.userRepository.save(user);
    const session = this.gameSessionRepository.create({
      userId,
      result,
      gameType: 'advanced-blackjack',
      details: { playerCards, dealerCards, bet, action, payout },
    });
    const savedSession = await this.gameSessionRepository.save(session);
    return {
      result,
      playerCards,
      dealerCards,
      payout,
      sessionId: savedSession.id,
    };
  }

  private getRandomCard(): number {
    return this.randomGeneratorService.getRandomInt(1, 11);
  }
}
