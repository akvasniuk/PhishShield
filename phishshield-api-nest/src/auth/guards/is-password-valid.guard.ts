import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordHelper } from '../../users/helpers/password.helper';

@Injectable()
export class IsPasswordValidGuard implements CanActivate {
  constructor(private readonly passwordHelper: PasswordHelper) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { password } = request.body;
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.passwordHelper.compare(password, user.password);
    return true;
  }
}
