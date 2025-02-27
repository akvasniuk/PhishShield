import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { AuthRepository } from '../auth.repository';
import { CustomRequest } from '../../users/interfaces/custom-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const token = request.get('Authorization');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    await this.tokenService.verifyToken(token);
    const tokenObject = await this.authRepository.getAuthByToken(token);

    if (!tokenObject) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = tokenObject.user;
    return true;
  }
}
