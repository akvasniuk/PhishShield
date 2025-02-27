import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UsernameGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { username } = request.body;
    const { user } = request;

    const userUsername = `${user.firstname} ${user.lastname}`;

    if (username !== userUsername) {
      throw new BadRequestException('Username does not match user profile');
    }

    return true;
  }
}