import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class IsUserActivatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user?.isUserActivated) {
      throw new UnauthorizedException('User is not activated');
    }

    return true;
  }
}