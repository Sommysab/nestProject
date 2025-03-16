import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { RegisterValidate, LoginValidate, BiometricValidate } from './dto/input.dto';
import { AuthResponse, User } from './dto/response.dto';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  /**
   * Registers a new user with the provided email and password.
   * @param authInput - The user registration input containing email and password.
   * @returns An authentication response indicating success.
   */
  @Mutation(() => AuthResponse)
  @UsePipes(new ValidationPipe()) // input validation
  async register(@Args() authInput: RegisterValidate) {
    const { email, password } = authInput;
    return this.userService.register(email, password);
  }

  /**
   * Logs in a user with the provided credentials.
   * @param authInput - The login input containing email and password.
   * @returns An authentication response with a JWT token on success.
   */
  @Mutation(() => AuthResponse)
  @UsePipes(new ValidationPipe()) // input validation
  async login(@Args() authInput: LoginValidate) {
    const { email, password } = authInput;
    return this.userService.login(email, password);
  }

  /**
   * Updates or registers a biometric key for authentication.
   * Requires authentication via JWT.
   * @param context - The GraphQL execution context containing the authenticated user.
   * @param authInput - The biometric key input.
   * @returns A success message confirming biometric key registration.
   */
  @UseGuards(AuthGuard) // Protects the route, requiring authentication
  @Mutation(() => AuthResponse)
  @UsePipes(new ValidationPipe()) // input validation
  async createUpdateBiometricKey(@Context() context, @Args() authInput: BiometricValidate) {
    const { biometricKey } = authInput;
    const { req } = context;
    return this.userService.createUpdateBiometricKey(req.user.id, biometricKey);
  }

  /**
   * Logs in a user using their biometric key.
   * @param authInput - The biometric key input for authentication.
   * @returns An authentication response with a JWT token on success.
   */
  @Mutation(() => AuthResponse)
  @UsePipes(new ValidationPipe()) // input validation
  async biometricLogin(@Args() authInput: BiometricValidate) {
    const { biometricKey } = authInput;
    return this.userService.biometricLogin(biometricKey);
  }

  /**
   * Retrieves a list of all registered users.
   * @returns An array of user objects.
   */
  @Query(() => [User])
  async getUsers() {
    return this.userService.getAllUsers();
  }
}
