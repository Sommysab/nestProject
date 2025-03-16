import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { BiometricValidate } from './dto/input.dto';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  const mockUserService = {
    register: jest.fn().mockResolvedValue({ message: 'Registered successfully', token: 'mocked-token' }),
    login: jest.fn().mockResolvedValue({ message: 'Logged in successfully', token: 'mocked-token' }),
    createUpdateBiometricKey: jest.fn().mockResolvedValue({ message: 'Biometric key registered successfully' }),
    biometricLogin: jest.fn().mockResolvedValue({ message: 'Logged in successfully', token: 'mocked-token' }),
    getAllUsers: jest.fn().mockResolvedValue([{ id: 'user-id', email: 'test@example.com' }]),
  };

  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: mockUserService },
        { provide: AuthGuard, useValue: mockAuthGuard },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  it('should register a user', async () => {
    const result = await resolver.register({ email: 'test@example.com', password: 'password123' });
    expect(result).toEqual({ message: 'Registered successfully', token: 'mocked-token' });
    expect(userService.register).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should login a user', async () => {
    const result = await resolver.login({ email: 'test@example.com', password: 'password123' });
    expect(result).toEqual({ message: 'Logged in successfully', token: 'mocked-token' });
    expect(userService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should update biometric key', async () => {
    const context = { req: { user: { id: 'user-id' } } };
    const result = await resolver.createUpdateBiometricKey(context, { biometricKey: 'encrypted-key' });
    expect(result).toEqual({ message: 'Biometric key registered successfully' });
    expect(userService.createUpdateBiometricKey).toHaveBeenCalledWith('user-id', 'encrypted-key');
  });

  it('should login with biometric key', async () => {
    const result = await resolver.biometricLogin({ biometricKey: 'encrypted-key' });
    expect(result).toEqual({ message: 'Logged in successfully', token: 'mocked-token' });
    expect(userService.biometricLogin).toHaveBeenCalledWith('encrypted-key');
  });

  it('should return a list of users', async () => {
    const result = await resolver.getUsers();
    expect(result).toEqual([{ id: 'user-id', email: 'test@example.com' }]);
    expect(userService.getAllUsers).toHaveBeenCalled();
  });
});
