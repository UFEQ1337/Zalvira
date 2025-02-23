import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class RandomGeneratorService {
  getRandomInt(min: number, max: number): number {
    return randomInt(min, max + 1);
  }

  getRandom(): number {
    return this.getRandomInt(0, 1000000) / 1000000;
  }
}
