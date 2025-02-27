import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/token.service';
import { AuthRepository } from '../auth.repository';


@Injectable()
export class PasswordTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const passwordToken = request.params.passwordToken;

    if (!passwordToken) {
      throw new UnauthorizedException('No password token provided');
    }

    await this.tokenService.verifyPasswordToken(passwordToken);

    const tokenObject = await this.authRepository.getAuthByPasswordToken(passwordToken);

    if (!tokenObject) {
      throw new UnauthorizedException('Invalid password token');
    }

    request['tokenObject'] = tokenObject;
    return true;
  }
}
