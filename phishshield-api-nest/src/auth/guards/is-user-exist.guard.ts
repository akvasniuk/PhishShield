import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../users/user.repository';

@Injectable()
export class IsUserExistGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;

    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    request.user = user;
    return true;
  }
}
