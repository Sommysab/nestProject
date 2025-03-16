import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  /**
   * Registers a new user by hashing their password and storing it in the database.
   * @param email - The email address of the user.
   * @param password - The plain-text password to be hashed and stored.
   * @throws BadRequestException if the email is already registered.
   * @returns A success message on successful registration.
   */
  async register(email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.create({ data: { email, password: hashedPassword } });

    return { message: 'User registered successfully' };
  }

  /**
   * Authenticates a user using email and password.
   * @param email - The user's email address.
   * @param password - The user's plain-text password.
   * @throws UnauthorizedException if the credentials are invalid.
   * @returns A success message along with a signed JWT token.
   */
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Verify user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Logged in successfully!',
      token: this.jwtService.sign({ id: user.id }) // Only signing necessary user data to reduce exposure
    };
  }

  /**
   * Creates or updates a user's biometric authentication key.
   * @param userId - The ID of the user.
   * @param encryptedFingerprintData - The encrypted biometric data.
   * @returns A success message confirming biometric key registration.
   */
  async createUpdateBiometricKey(userId: string, encryptedFingerprintData: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { biometricKey: encryptedFingerprintData },
    });

    return { message: 'Biometric key registered successfully' };
  }

  /**
   * Authenticates a user using biometric data.
   * @param encryptedFingerprintData - The encrypted fingerprint data.
   * @throws UnauthorizedException if the biometric key is invalid.
   * @returns A success message along with a signed JWT token.
   */
  async biometricLogin(encryptedFingerprintData: string) {
    const user = await this.prisma.user.findUnique({ where: { biometricKey: encryptedFingerprintData } });
    if (!user) {
      throw new UnauthorizedException('Invalid biometric key');
    }

    return {
      message: 'Logged in successfully!',
      token: this.jwtService.sign({ id: user.id })
    };
  }

  /**
   * Retrieves a list of all users from the database.
   * @returns An array of user objects.
   */
  async getAllUsers() {
    return await this.prisma.user.findMany();
  }
}
