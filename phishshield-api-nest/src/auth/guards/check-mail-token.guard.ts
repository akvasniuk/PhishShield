import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../services/token.service';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class CheckMailTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { emailToken } = request.params;

    if (!emailToken) {
      throw new UnauthorizedException('No token provided');
    }

    await this.tokenService.verifyEmailToken(emailToken);
    const tokenObject = await this.authRepository.getAuthByMailToken(emailToken);

    if (!tokenObject) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = tokenObject.user;
    return true;
  }
}
