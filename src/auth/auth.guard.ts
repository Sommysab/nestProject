import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Determines whether the request is authorized by verifying the JWT token.
   * @param context - The execution context of the GraphQL request.
   * @returns A boolean indicating whether the request is allowed.
   * @throws UnauthorizedException if the token is missing, invalid, or expired.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // Retrieve the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    try {
      // Verify the token and attach the decoded user data to the request object
      const decoded = this.jwtService.verify(token);
      req.user = decoded;
      return true; // Grant access
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
