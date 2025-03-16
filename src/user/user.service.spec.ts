import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {

    it('should successfully register a new user', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed-password');
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: '123',
        email,
        password: 'hashed-password',
        biometricKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await userService.register(email, password);
      expect(result).toEqual({ message: 'User registered successfully' });
    });

    it('should throw BadRequestException if email is already in use', async () => {
      // jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({ email: 'test@example.com' });
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        password: 'hashed-password',
        biometricKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });      

      await expect(userService.register('test@example.com', 'password123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should login successfully and return a token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = { 
        id: 'user-id',
        email, password:
        'hashed-password',
        biometricKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await userService.login(email, password);
      expect(result).toEqual({
        message: 'Logged in successfully!',
        token: 'mocked-jwt-token',
      });
    });

    it('should throw UnauthorizedException if credentials are incorrect', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(userService.login('test@example.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('createUpdateBiometricKey', () => {
    it('should update the biometric key successfully', async () => {
      const userId = 'user-id';
      const biometricKey = 'encrypted-fingerprint';
      const updatedUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashed-password', // Required field
        biometricKey, // Updated biometric key
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await userService.createUpdateBiometricKey(userId, biometricKey);
      expect(result).toEqual({ message: 'Biometric key registered successfully' });
    });
  });

  describe('biometricLogin', () => {
    it('should login successfully with a biometric key', async () => {
      const biometricKey = 'encrypted-fingerprint';
      // const user = { id: 'user-id', biometricKey };
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password',
        biometricKey,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await userService.biometricLogin(biometricKey);
      expect(result).toEqual({
        message: 'Logged in successfully!',
        token: 'mocked-jwt-token',
      });
    });

    it('should throw UnauthorizedException if biometric key is invalid', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(userService.biometricLogin('invalid-key')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const users = [{ 
        id: 'user1',
        email: 'test1@example.com',
        password: 'hashed-password',
        biometricKey: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }];
      
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      const result = await userService.getAllUsers();
      expect(result).toEqual(users);
    });
  });
});
