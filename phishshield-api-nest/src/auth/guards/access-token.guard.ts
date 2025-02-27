import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthRepository } from '../auth.repository';
import { TokenService } from '../services/token.service';


@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.get('Authorization');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    await this.tokenService.verifyToken(token);
    const tokenObject = await this.authRepository.getAuthByAccessToken(token);

    if (!tokenObject) {
      throw new UnauthorizedException('Invalid token');
    }

    request['user'] = tokenObject.user;
    return true;
  }
}
