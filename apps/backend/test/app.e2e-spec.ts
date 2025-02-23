/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
/// <reference types="jest" />

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { AppModule } from '../src/app.module';
const { io } = require('socket.io-client');
import type { Socket } from 'socket.io-client';
import { User } from '../src/modules/auth/entities/user.entity';

interface RegisterResponse {
  message: string;
  userId: number;
}

interface LoginResponse {
  access_token: string;
}

interface BasicGameResponse {
  userId: number;
  result: string;
  sessionId: number;
}

interface SlotMachineResponse {
  outcome: string;
  reels: string[];
  payout: number;
  sessionId: number;
}

interface BlackjackResponse {
  outcome: string;
  playerCards: number[];
  dealerCards: number[];
  payout: number;
  sessionId: number;
}

interface RouletteResponse {
  outcome: string;
  winningNumber: number;
  payout: number;
  sessionId: number;
}

interface DiceResponse {
  outcome: string;
  dice: number[];
  sum: number;
  payout: number;
  sessionId: number;
}

interface BaccaratResponse {
  outcome: string;
  winner: string;
  payout: number;
  sessionId: number;
}

interface ScratchCardResponse {
  outcome: string;
  cards: string[];
  payout: number;
  sessionId: number;
}

interface WalletResponse {
  message: string;
  newBalance: number;
}

interface OverallStats {
  totalUsers: number;
  totalDeposits: number;
  totalGames: number;
}

interface UserResponse {
  id: number;
  email: string;
  username: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

describe('Extended E2E Tests for Zalvira Backend', () => {
  let app: INestApplication;
  let userId: number;
  let recipientUserId: number;
  let adminTestUserId: number;
  let accessToken: string;
  let recipientAccessToken: string;
  let adminAccessToken: string;
  let registeredEmail: string;
  let recipientEmail: string;
  let adminEmail: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Czyszczenie: usuwamy utworzone testowe konta.
    const userRepository = app.get(getRepositoryToken(User));
    const deleteUser = async (id: number) => {
      try {
        await request(app.getHttpServer())
          .delete(`/admin/users/${id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`);
      } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
      }
    };
    if (userId) await deleteUser(userId);
    if (recipientUserId) await deleteUser(recipientUserId);
    if (adminTestUserId) await deleteUser(adminTestUserId);
    await app.close();
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const registerData = {
        email: `extended_${Date.now()}@example.com`,
        password: 'pass1234',
        username: 'extendedUser',
      };
      registeredEmail = registerData.email;
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      const body = res.body as RegisterResponse;
      expect(body.message).toEqual('User registered successfully');
      expect(body).toHaveProperty('userId');
      userId = body.userId;
    });

    it('should login with registered user and obtain JWT token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: registeredEmail, password: 'pass1234' })
        .expect(200);

      const body = res.body as LoginResponse;
      expect(body).toHaveProperty('access_token');
      accessToken = body.access_token;
    });

    it('should register a recipient user for transfers', async () => {
      const registerData = {
        email: `recipient_${Date.now()}@example.com`,
        password: 'recipientPass123',
        username: 'recipientUser',
      };
      recipientEmail = registerData.email;
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      const body = res.body as RegisterResponse;
      expect(body.message).toEqual('User registered successfully');
      expect(body).toHaveProperty('userId');
      recipientUserId = body.userId;
    });

    it('should login with recipient user and obtain JWT token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: recipientEmail, password: 'recipientPass123' })
        .expect(200);

      const body = res.body as LoginResponse;
      expect(body).toHaveProperty('access_token');
      recipientAccessToken = body.access_token;
    });

    it('should register an admin user', async () => {
      const registerData = {
        email: `admin_test_${Date.now()}@example.com`,
        password: 'adminPass123',
        username: 'adminTestUser',
      };
      adminEmail = registerData.email;
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      const body = res.body as RegisterResponse;
      adminTestUserId = body.userId;
      // Ustawiamy rolę admina dla testowego admina
      const userRepository = app.get(getRepositoryToken(User));
      await userRepository.update(adminTestUserId, { roles: ['admin'] });
    });

    it('should login with admin user and obtain JWT token', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminEmail, password: 'adminPass123' })
        .expect(200);

      const body = res.body as LoginResponse;
      expect(body).toHaveProperty('access_token');
      adminAccessToken = body.access_token;
    });
  });

  describe('Wallet Operations', () => {
    it('should deposit funds into the user wallet', async () => {
      const depositData = { amount: 500 };
      const res = await request(app.getHttpServer())
        .post('/wallet/deposit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(depositData)
        .expect(201);

      const body = res.body as WalletResponse;
      expect(body.message).toEqual('Deposit successful');
      expect(body).toHaveProperty('newBalance');
      expect(body.newBalance).toBeGreaterThanOrEqual(500);
    });

    it('should fail withdrawal when funds are insufficient', async () => {
      const withdrawData = { amount: 1000 };
      const res = await request(app.getHttpServer())
        .post('/wallet/withdraw')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(withdrawData)
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('should withdraw funds from the user wallet', async () => {
      const withdrawData = { amount: 200 };
      const res = await request(app.getHttpServer())
        .post('/wallet/withdraw')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(withdrawData)
        .expect(201);

      const body = res.body as WalletResponse;
      expect(body.message).toEqual('Withdrawal successful');
      expect(body).toHaveProperty('newBalance');
      expect(body.newBalance).toBeLessThan(500);
    });

    it('should transfer funds to another user', async () => {
      // Najpierw deponujemy środki, aby mieć fundusze
      await request(app.getHttpServer())
        .post('/wallet/deposit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ amount: 300 })
        .expect(201);

      const transferData = {
        amount: 100,
        recipientEmail, // używamy zarejestrowanego emaila odbiorcy
      };

      const res = await request(app.getHttpServer())
        .post('/wallet/transfer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(transferData)
        .expect(201);

      expect(res.body).toHaveProperty('message', 'Transfer successful');
      expect(res.body).toHaveProperty('senderNewBalance');
      expect(res.body).toHaveProperty('recipientId');
    });
  });

  describe('Casino Games', () => {
    it('should start a basic game session', async () => {
      const startGameData = { bet: 50 };
      const res = await request(app.getHttpServer())
        .post('/casino/start')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(startGameData)
        .expect(201);

      const body = res.body as BasicGameResponse;
      expect(body).toHaveProperty('userId', userId);
      expect(body).toHaveProperty('result');
      expect(body).toHaveProperty('sessionId');
    });

    it('should play slot machine game', async () => {
      const slotData = { bet: 50 };
      const res = await request(app.getHttpServer())
        .post('/casino/slot-machine')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(slotData)
        .expect(201);

      const body = res.body as SlotMachineResponse;
      expect(body).toHaveProperty('outcome');
      expect(body).toHaveProperty('reels');
      expect(Array.isArray(body.reels)).toBe(true);
      expect(body).toHaveProperty('payout');
      expect(body).toHaveProperty('sessionId');
    });

    it('should play blackjack game', async () => {
      const blackjackData = { bet: 50 };
      const res = await request(app.getHttpServer())
        .post('/casino/blackjack')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(blackjackData)
        .expect(201);

      const body = res.body as BlackjackResponse;
      expect(body).toHaveProperty('outcome');
      expect(body).toHaveProperty('playerCards');
      expect(Array.isArray(body.playerCards)).toBe(true);
      expect(body).toHaveProperty('dealerCards');
      expect(Array.isArray(body.dealerCards)).toBe(true);
      expect(body).toHaveProperty('payout');
      expect(body).toHaveProperty('sessionId');
    });

    it('should play roulette game', async () => {
      const rouletteData = { bet: 50, chosenNumber: 17 };
      const res = await request(app.getHttpServer())
        .post('/casino/roulette')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(rouletteData)
        .expect(201);

      const body = res.body as RouletteResponse;
      expect(body).toHaveProperty('outcome');
      expect(body).toHaveProperty('winningNumber');
      expect(typeof body.winningNumber).toBe('number');
      expect(body).toHaveProperty('payout');
      expect(body).toHaveProperty('sessionId');
    });

    it('should play dice game', async () => {
      const diceData = { bet: 50, chosenSum: 7 };
      const res = await request(app.getHttpServer())
        .post('/casino/dice')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(diceData)
        .expect(201);

      const body = res.body as DiceResponse;
      expect(body).toHaveProperty('outcome');
      expect(body).toHaveProperty('dice');
      expect(Array.isArray(body.dice)).toBe(true);
      expect(body).toHaveProperty('sum');
      expect(body).toHaveProperty('payout');
      expect(body).toHaveProperty('sessionId');
    });

    it('should play baccarat game', async () => {
      const baccaratData = { bet: 50, betOn: 'player' as const };
      const res = await request(app.getHttpServer())
        .post('/casino/baccarat')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(baccaratData)
        .expect(201);

      const body = res.body as BaccaratResponse;
      expect(body).toHaveProperty('outcome');
      expect(body).toHaveProperty('winner');
      expect(body).toHaveProperty('payout');
      expect(body).toHaveProperty('sessionId');
    });

    it('should play scratch card game', async () => {
      const scratchData = { bet: 50 };
      const res = await request(app.getHttpServer())
        .post('/casino/scratch-card')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(scratchData)
        .expect(201);

      const body = res.body as ScratchCardResponse;
      expect(body).toHaveProperty('outcome');
      expect(body).toHaveProperty('cards');
      expect(Array.isArray(body.cards)).toBe(true);
      expect(body).toHaveProperty('payout');
      expect(body).toHaveProperty('sessionId');
    });

    it('should play advanced blackjack game', async () => {
      const advancedData = { bet: 50, action: 'stand' as const };
      const res = await request(app.getHttpServer())
        .post('/casino/advanced-blackjack')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(advancedData)
        .expect(201);

      const body = res.body as BlackjackResponse;
      expect(body).toHaveProperty('result');
      expect(body).toHaveProperty('playerCards');
      expect(body).toHaveProperty('dealerCards');
      expect(body).toHaveProperty('payout');
      expect(body).toHaveProperty('sessionId');
    });
  });

  describe('User Profile Operations', () => {
    it('should get user profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = res.body as UserResponse;
      expect(body).toHaveProperty('id', userId);
      expect(body).toHaveProperty('email');
    });

    it('should update user profile', async () => {
      const updateData = { username: 'updatedExtendedUser' };
      const res = await request(app.getHttpServer())
        .patch('/user/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      const body = res.body as UserResponse;
      expect(body).toHaveProperty('username', updateData.username);
    });

    it('should get wallet transactions via user profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/wallet')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get game sessions via user profile', async () => {
      const res = await request(app.getHttpServer())
        .get('/user/games')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.total).toBe('number');
    });
  });

  describe('Chat Operations', () => {
    let socket: ReturnType<typeof io>;
    const chatUrl = 'http://localhost:3001/chat';

    beforeAll((done) => {
      jest.setTimeout(20000);
      socket = io(chatUrl, { transports: ['websocket'] });
      socket.on('connect', () => done());
      socket.on('connect_error', (err: unknown) => {
        console.error('Socket connect_error:', err);
        done(err);
      });
    });

    afterAll(() => {
      socket.close();
    });

    it('should join a room and receive confirmation', (done) => {
      socket.emit('joinRoom', 'game123');
      socket.once('joinedRoom', (data: { room: string }) => {
        expect(data.room).toEqual('game123');
        done();
      });
    });

    it('should send a message and receive it in the room', (done) => {
      const payload = {
        room: 'game123',
        user: 'TestUser',
        message: 'Hello, world!',
      };
      socket.emit('sendMessage', payload);
      socket.once(
        'message',
        (received: { room: string; user: string; message: string }) => {
          expect(received).toEqual(payload);
          done();
        },
      );
    });
  });

  describe('Admin Operations', () => {
    let adminToken: string;
    beforeAll(async () => {
      const registerData = {
        email: `admin_test_${Date.now()}@example.com`,
        password: 'adminPass123',
        username: 'adminTestUser',
      };
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      const body = res.body as RegisterResponse;
      adminTestUserId = body.userId;
      adminEmail = registerData.email;

      // Ustawiamy rolę admina
      const userRepository = app.get(getRepositoryToken(User));
      await userRepository.update(adminTestUserId, { roles: ['admin'] });

      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: adminEmail, password: 'adminPass123' })
        .expect(200);
      const loginBody = loginRes.body as LoginResponse;
      adminToken = loginBody.access_token;
    });

    it('should retrieve all users', async () => {
      const res = await request(app.getHttpServer())
        .get('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should retrieve a single user by ID', async () => {
      const res = await request(app.getHttpServer())
        .get(`/admin/users/${adminTestUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body = res.body as UserResponse;
      expect(body).toHaveProperty('id', adminTestUserId);
      expect(body).toHaveProperty('email');
    });

    it('should update a user', async () => {
      const updateData = { username: 'updatedAdminTestUser' };
      const res = await request(app.getHttpServer())
        .patch(`/admin/users/${adminTestUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      const body = res.body as UserResponse;
      expect(body).toHaveProperty('username', updateData.username);
    });

    it('should get wallet transactions for a user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/admin/users/${adminTestUserId}/wallet`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get game sessions for a user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/admin/users/${adminTestUserId}/games`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should retrieve overall statistics', async () => {
      const res = await request(app.getHttpServer())
        .get('/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body = res.body as OverallStats;
      expect(body).toHaveProperty('totalUsers');
      expect(body).toHaveProperty('totalDeposits');
      expect(body).toHaveProperty('totalGames');
    });

    it('should delete a user', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/admin/users/${adminTestUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('message');
      await request(app.getHttpServer())
        .get(`/admin/users/${adminTestUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
