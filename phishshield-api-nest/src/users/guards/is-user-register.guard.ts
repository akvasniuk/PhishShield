import { CanActivate, ExecutionContext, Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from '../user.repository';

@Injectable()
export class IsUserRegisterGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;

    const userByEmail = await this.usersRepository.findUserByEmail(email);
    if (userByEmail) {
      throw new ConflictException('User is already registered');
    }

    return true;
  }
}
