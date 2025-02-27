import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/token.service';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.get('Authorization');

    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    await this.tokenService.verifyToken(token, 'refresh');

    const tokenObject = await this.authRepository.getAuthByRefreshToken(token);

    if (!tokenObject) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    request['user'] = tokenObject;
    return true;
  }
}
